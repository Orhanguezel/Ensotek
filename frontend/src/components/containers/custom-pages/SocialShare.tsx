"use client";
import React from "react";
import Link from "next/link";

interface SocialShareProps {
  url: string;
  title: string;
  label?: string;
}

const SocialShare = ({ url: initialUrl, title, label }: SocialShareProps) => {
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    setUrl(initialUrl || window.location.href);
  }, [initialUrl]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: "fa-brands fa-facebook-f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "#3b5998"
    },
    {
      name: "Twitter",
      icon: "fa-brands fa-twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "#1da1f2"
    },
    {
      name: "LinkedIn",
      icon: "fa-brands fa-linkedin-in",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: "#0077b5"
    },
    {
      name: "WhatsApp",
      icon: "fa-brands fa-whatsapp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "#25d366"
    }
  ];

  return (
    <div className="social-share-wrapper d-flex align-items-center">
      <span className="mr-15 font-weight-bold" style={{ fontSize: '14px', color: '#666' }}>{(label || 'SHARE')?.toUpperCase()}:</span>
      <div className="share-links d-flex">
        {shareLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="share-item mr-10 d-flex align-items-center justify-content-center"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#f8f9fa",
              color: social.color,
              fontSize: "16px",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = social.color;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
              e.currentTarget.style.color = social.color;
            }}
            title={`Share on ${social.name}`}
          >
            <i className={social.icon}></i>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialShare;
