"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface PageReactionProps {
  pageId: string;
}

const PageReaction = ({ pageId }: PageReactionProps) => {
  const t = useTranslations("ensotek.customPage");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // Check local storage for like status
    const isLiked = localStorage.getItem(`like_${pageId}`);
    setLiked(!!isLiked);
    
    // In a real app, we would fetch the true like count from the backend here
    const baseCount = parseInt(pageId.substring(0, 2), 16) % 50 + 5;
    setLikeCount(liked ? baseCount + 1 : baseCount);
  }, [pageId, liked]);

  const handleLike = () => {
    if (liked) {
      localStorage.removeItem(`like_${pageId}`);
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      localStorage.setItem(`like_${pageId}`, "true");
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  return (
    <div className="page-reaction-wrapper d-flex align-items-center">
      <button 
        onClick={handleLike}
        className={`like-btn mr-15 d-flex align-items-center justify-content-center ${liked ? 'active' : ''}`}
        style={{
          border: '1px solid #eee',
          background: liked ? '#fff1f1' : '#f8f9fa',
          padding: '8px 20px',
          borderRadius: '25px',
          transition: 'all 0.3s ease',
          color: liked ? '#e0245e' : '#666',
          fontWeight: '600',
          fontSize: '14px',
          borderColor: liked ? '#ffbaba' : '#eee',
          cursor: 'pointer'
        }}
      >
        <i className={`${liked ? 'fa-solid' : 'fa-light'} fa-heart mr-8`} style={{ fontSize: '16px' }}></i>
        {liked ? t("liked") : t("like")}
      </button>
      <span className="text-muted" style={{ fontSize: '13px' }}>
        {t("likeCount", { count: likeCount })}
      </span>
      
      <style jsx>{`
        .like-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          border-color: #ffbaba;
        }
        .like-btn.active:hover {
          background: #ffebeb;
        }
      `}</style>
    </div>
  );
};

export default PageReaction;
