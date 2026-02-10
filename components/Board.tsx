
import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../types';
import { User } from 'firebase/auth';

interface BoardProps {
  user: User;
}

const Board: React.FC<BoardProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setIsInitialLoading(false);
    }, (error) => {
      console.error("Firestore subscription error:", error);
      setIsInitialLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = editorRef.current?.innerHTML || '';
    
    if (!title.trim() || !content.trim() || content === '<br>') {
      alert("Please enter both a title and some content.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        content: content, // Now saving HTML string
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      setTitle('');
      if (editorRef.current) editorRef.current.innerHTML = '';
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("Failed to save post. Ensure Firestore rules are set to allow reads/writes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (error) {
        console.error("Error deleting post: ", error);
      }
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Create Post Form with Rich Text Editor */}
      <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Create New Post</h3>
        </div>
        
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="What's the title?"
              className="w-full bg-slate-900/50 border border-slate-700 text-white px-5 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-500 font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Rich Text Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900/80 border border-slate-700 rounded-t-xl">
            <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-slate-700 rounded text-slate-300 font-bold" title="Bold">B</button>
            <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-slate-700 rounded text-slate-300 italic" title="Italic">I</button>
            <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-slate-700 rounded text-slate-300 underline" title="Underline">U</button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Bullet List">• List</button>
            <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-slate-700 rounded text-slate-300" title="Numbered List">1. List</button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <button type="button" onClick={() => execCommand('formatBlock', 'h2')} className="p-2 hover:bg-slate-700 rounded text-slate-300 text-xs font-bold" title="Heading 2">H2</button>
            <button type="button" onClick={() => execCommand('formatBlock', 'p')} className="p-2 hover:bg-slate-700 rounded text-slate-300 text-xs" title="Normal Text">P</button>
          </div>

          {/* Content Editable Area */}
          <div 
            ref={editorRef}
            contentEditable
            className="w-full min-h-[160px] bg-slate-900/50 border-x border-b border-slate-700 text-white px-5 py-4 rounded-b-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all prose prose-invert max-w-none overflow-y-auto"
            style={{ whiteSpace: 'pre-wrap' }}
          ></div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Post List Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white px-2">Latest Activity</h3>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500">No posts yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="bg-slate-800/20 border border-slate-700/30 p-6 rounded-3xl group transition-all hover:bg-slate-800/40"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-indigo-400">
                    {post.title}
                  </h4>
                  {post.authorId === user.uid && (
                    <button 
                      onClick={() => post.id && handleDeletePost(post.id)}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Render Rich Text Content */}
                <div 
                  className="text-slate-300 mb-6 prose prose-invert prose-sm max-w-none break-words overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="flex items-center justify-between pt-4 border-t border-slate-700/30 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      {post.authorName.charAt(0)}
                    </div>
                    <span className="text-slate-400 font-medium">{post.authorName}</span>
                  </div>
                  <span className="text-slate-500">
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Board;
