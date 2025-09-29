"use client";

import React from "react";
import LinkedInPostsGrid from "./LinkedInPostsGrid";

const samplePosts = [
  {
    id: "1",
    content: "🚀 Just launched our new product! This has been an incredible journey of innovation and dedication. After months of development, we're excited to share something that will revolutionize how you work.\n\nKey features:\n• AI-powered automation\n• Seamless integration\n• 10x faster processing\n\nWhat do you think? Drop your thoughts below! 👇\n\n#Innovation #ProductLaunch #AI #Startup",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    content: "💡 **5 Game-Changing Leadership Lessons** I learned this year:\n\n1. **Listen more, speak less** - The best insights come from your team\n2. **Embrace failure** - Every setback is a setup for a comeback\n3. **Be vulnerable** - Authenticity builds trust faster than perfection\n4. **Invest in people** - Your team's growth is your company's growth\n5. **Stay curious** - Never stop learning and questioning\n\nWhich resonates most with you? 🤔\n\n#Leadership #Growth #Management #Team",
  },
  {
    id: "3",
    content: "🎯 The secret to productivity? It's not about working harder, it's about working **smarter**.\n\nHere's my daily routine that changed everything:\n\n→ Start with the hardest task\n→ Time-block everything\n→ Take real breaks (not phone scrolling)\n→ End with tomorrow's priorities\n\nSimple but effective. What's your productivity hack?\n\n#Productivity #TimeManagement #WorkLife",
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    content: "📊 **Data doesn't lie, but it can mislead.**\n\nAfter analyzing 10,000+ customer interactions, here's what I learned:\n\n• Context matters more than numbers\n• Correlation ≠ Causation (always!)\n• Small samples can be dangerous\n• Gut feeling + data = gold\n\nAlways question your data. What story is it really telling?\n\n#DataScience #Analytics #Business #Insights",
  },
  {
    id: "5",
    content: "🌟 **Gratitude post** 🌟\n\nAs we wrap up this quarter, I want to thank:\n\n• My incredible team for their dedication\n• Our clients for trusting us with their vision\n• My mentors for their guidance\n• The LinkedIn community for constant inspiration\n\nGrowth happens when great people come together. Here's to the next chapter! 🚀\n\n#Gratitude #Team #Growth #Community",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    content: "⚡ **Quick reminder:** Your network is your net worth.\n\nBut it's not about collecting connections – it's about building genuine relationships.\n\n• Be helpful before asking for help\n• Follow up and follow through\n• Share others' wins\n• Be genuinely interested in people\n\nQuality > Quantity, always.\n\n#Networking #Relationships #Career #Growth",
  },
];

const LinkedInPostsDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LinkedIn Posts Preview
          </h1>
          <p className="text-gray-600">
            Showcase of responsive LinkedIn post previews with proper scaling and grid layout
          </p>
        </div>
        
        <LinkedInPostsGrid posts={samplePosts} />
      </div>
    </div>
  );
};

export default LinkedInPostsDemoPage;