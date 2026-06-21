"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Send, TrendingUp } from "lucide-react";
import { DEMO_POSTS } from "@/lib/demo-data";

const trending = ["CeraVe", "NaturalSkincare", "IngredientCheck", "GlowUp", "SkincareRoutine"];

export default function CommunityPage() {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [newPost, setNewPost] = useState("");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + (liked.has(id) ? -1 : 1) } : p));
  };

  const submit = () => {
    if (!newPost.trim()) return;
    setPosts(prev => [{
      id: `post_new_${Date.now()}`, author: "Sophia Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
      time: "Just now", content: newPost, tags: [], likes: 0, comments: 0,
    }, ...prev]);
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-dark p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-playfair font-bold text-dark dark:text-white">Community</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Share your beauty journey</p>
      </div>

      {/* Compose */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share a tip, review, or update…"
          rows={3} className="w-full bg-transparent text-dark dark:text-white placeholder-gray-400 resize-none focus:outline-none text-sm" />
        <div className="flex justify-end">
          <button onClick={submit} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 text-dark text-sm font-semibold hover:bg-gold-400 transition-colors">
            <Send className="w-4 h-4" /> Post
          </button>
        </div>
      </div>

      {/* Trending */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gold-500" />
          <p className="text-sm font-semibold text-dark dark:text-white">Trending</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {trending.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 text-xs font-medium cursor-pointer hover:bg-gold-100 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full bg-cream-100" />
              <div>
                <p className="font-semibold text-dark dark:text-white text-sm">{post.author}</p>
                <p className="text-xs text-gray-400">{post.time}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{post.content}</p>
            {post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs text-gold-600 dark:text-gold-400 font-medium">#{tag}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 pt-1 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 text-sm transition-colors ${liked.has(post.id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
                <Heart className={`w-4 h-4 ${liked.has(post.id) ? "fill-current" : ""}`} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gold-500 transition-colors">
                <MessageCircle className="w-4 h-4" /> {post.comments}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gold-500 transition-colors ml-auto">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
