/* eslint-disable @typescript-eslint/no-explicit-any */
// common/constants/template-data.ts

import { fetchAwsAsset } from "@/lib/aws-s3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TemplateData = {
  [key: string]: any;
};

export const templateData: TemplateData = {
  "social-banner": {
    default: {
      title:
        "Build a Memorable Personal Brand,<font color={{highlightColor}} > Without Hiring a Team</font>",
      description:
        "Your all-in-one personal brand OS — from <font color={{highlightColor}} >strategy to content,</font> made simple.",
      imageUrl: fetchAwsAsset("dummy", "png"),
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "Start Free Trial",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "1": {
      title:
        "Build a Memorable Personal Brand,<font color={{highlightColor}} > Without Hiring a Team</font>",
      description:
        "Your all-in-one personal brand OS — from <font color={{highlightColor}} >strategy to content,</font> made simple.",
      imageUrl: fetchAwsAsset("dummy", "png"),
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "Start Free Trial",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "4": {
      title:
        "Build a Memorable Personal Brand,<font color={{highlightColor}}> Without Hiring a Team </font>",
      subTitle: "Meet the Tool Behind 10,000+ Personal Brands",
      description:
        "“Your all-in-one personal brand OS from <font color={{highlightColor}}>strategy to content,</font> made simple.”",
      imageUrl: fetchAwsAsset("dummy", "png"), // Replace with your actual image
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "Start Free Trial",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "3": {
      title: "Build a Memorable Personal Brand, Without Hiring a Team",
      description:
        "Your all-in-one personal brand OS  from strategy to content, made simple.",
      imageUrl: fetchAwsAsset("dummy", "png"),
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "Start Free Trial",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "5": {
      title:
        "YOUR BRAND <font color={{highlightColor}}> DESIGN PARTNER </font> FOR <font color={{highlightColor}}> LINKEDIN </font> AND BEYOND",
      imageUrl: fetchAwsAsset("dummy", "png"), // Replace with your actual image
      imageAlt: "Professional headshot",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "2": {
      title: "Personal Branding Design Tool",
      description:
        "Finally master consistent visual content creation for Instagram, LinkedIn & more with your",
      imageUrl: fetchAwsAsset("dummy", "png"),
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "Try free for 7 days — no credit card needed",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "6": {
      title:
        "DON'T JUST APPLY STAND OUT! I HELP YOU CRAFT SUCCESS STORIES THAT GET YOU HIRED",
      highlightedText: "Worked with 500+ professionals globally.",
      imageAlt: "Professional headshot",
      imageUrl: fetchAwsAsset("dummy", "png"),
      ctaText: "JOIN OUR COMMUNITY",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "7": {
      title: "PERSONAL BRAND CONTENT",
      subTitle: "Helping Founders & Creators design their",
      description: "Build your personal brand with ready-to-use templates.",
      imageUrl: fetchAwsAsset("dummy", "png"),
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "SOCIAL POSTS BANNERS   BRANDING ASSETS",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "8": {
      title: "10X YOUR CUSTOMER LIFETIME VALUE",
      subTitle: "Transform Your Retention",
      description:
        "This is a secret I selfishly wanted to keep to myself...but she has been the secret behind my company going from $15k/month to $200k+/month!",
      imageUrl: fetchAwsAsset("dummy", "png"),
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText:
        "5M+ GENERATED | 100+ BRANDS SERVED |  4+ YEARS OF EXPERIENCE",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "9": {
      title: "Helping tech companies & startups build",
      description:
        "Helping tech companies & startups build fast to attract high-quality leads that convert.",
      imageUrl: fetchAwsAsset("dummy", "png"),
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "AI Campanies",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "10": {
      title: "Hey There 👋🏻",
      subTitle:
        "Do you want to get B2B SaaS content marketing insights directly in your LinkedIn feed?",
      description:
        "Do you want to get B2B SaaS content marketing insights directly in your LinkedIn feed?",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "Follow Me",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
    "11": {
      title: "10X YOUR CUSTOMER<br>LIFETIME VALUE",
      description:
        "This is a secret I selfishly wanted to keep to myself...but she has been the secret behind my company going from $15k/month to $200k+/month!",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText:
        "5M+ GENERATED | 100+ BRANDS SERVED |  4+ YEARS OF EXPERIENCE",
      showBrandMark: false,
      headshotPosition: { x: 0, y: 0 },
      headshotScale: 1,
      headshotOpacity: 1,
    },
  },
  "social-post": {
    default: {
      title:
        "<font color={{highlightColor}} >70%</font> of top professionals fail at <font color={{highlightColor}}> visual brand consistency.</font>",
      description:
        "Your all-in-one personal brand OS — from <font color={{highlightColor}} >strategy to content,</font> made simple.",
      imageAlt: "Professional headshot",
      ctaText: "JOIN OUR COMMUNITY",
      highlightedText: "Start Free Trial",
      showBrandMark: true,
    },
    "1": {
      title:
        "<font color={{highlightColor}} >70%</font> of top professionals fail at <font color={{highlightColor}}> visual brand consistency.</font>",
      showBrandMark: true,
    },
    "2": {
      title:
        "Branding is the <font color={{highlightColor}} >why.</font> <br><br> Marketing is the <font color={{highlightColor}} >how.</font>",
      showBrandMark: true,
    },
    "3": {
      title: "Working on your brand? Let's work together. 🤝",
      description:
        "My Services Include: Logo Design , Brand Identity , Flyer Design , and more...",
      highlightedText: "Follow me for more",
      showBrandMark: true,
    },
    "4": {
      title: "There are over 8 billion people in the world.🌍",
      description: `  -  Less than 1% actively build a personal brand. <br>
           -  Less than 1% share their expertise consistently. <br>
           -  Less than 1% position themselves as industry leaders. <br>
           -  Less than 1% attract opportunities instead of chasing them.<br><br>
          Instead of asking "Should I build a personal brand?" ask "HOW can I start today?"`,
      showBrandMark: true,
    },
  },
  "quote-card": {
    "1": {
      description:
        "Your personal brand is the only asset that compounds <b>faster than your bank account.</b>",
      name: "James Carter",
      socialHandle: "@jamescarter",
      profilePictureUrl: fetchAwsAsset("dummy", "png"),
      backgroundimgUrl: fetchAwsAsset("text-img-bg", "png"),
      showBrandMark: true,
    },
    "2": {
      description: "Your hook goes here.<br><br>Make it catchy.",
      showBrandMark: true,
    },
    "3": {
      description:
        "Put it on the calendar. <br><br>If it doesn't get time in your lille, it doesn't get done <br><br>Make your account management and content creation time a non-negotiable by adding it into your calendar. <br><br>I promise when you do this, you'll start being consistent and seeing results.",
      showBrandMark: true,
    },
    "4": {
      description:
        "Your personal brand is the only asset that compounds faster than your bank account. Because it earns you opportunities before it earns you income.<br><br>Want to know more?<br>Follow me",
      showBrandMark: true,
    },
    "5": {
      description:
        "As designers we create something out of nothing, and that is the true magic.",
      showBrandMark: true,
    },
    "6": {
      description:
        "As designers we create something out of nothing, and that is the true magic.✨",
      showBrandMark: false,
    },
  },
  "featured-post": {
    "1": {
      title:
        "Grow, Scale, and Monetize Your <font color={{highlightColor}} >Personal Brand.</font>",
      highlightedText: "LET'S CONNECT!",
      imageUrl: fetchAwsAsset("dummy", "png"),
      showBrandMark: true,
    },
    "2": {
      title: "LINKEDIN<br><font color={{highlightColor}} >POWER HOUR</font>",
      highlightedText: "ASK ME ANYTHING ABOUT LINKIEDIN",
      showBrandMark: false,
    },
    "3": {
      title:
        "TURN YOUR <font color={{highlightColor}} >PERSONAL BRAND</font> INTO THOUGHT LEADERSHIP",
      highlightedText: "Let’s leverage your personal brand!",
      subTitle: "Free 1-to-1 strategy call",
      showBrandMark: false,
    },
    "4": {
      title: "ELEVATING MARKETING WITH A MINDFULTOUCH",
      highlightedText: "Gain free insights!",
      subTitle: "Weekly newsletter",
      imageUrl: fetchAwsAsset("dummy", "png"),
      showBrandMark: true,
    },
    "5": {
      title: "Ask me anything about content design and conversion on LinkedIn",
      highlightedText: "Book a 1:1 coaching hour",
      showBrandMark: false,
    },
    "6": {
      title: "Turn Your LinkedIn Profile Into a 24/7 Sales Machine",
      description:
        "Ask me anything about content design and conversion on LinkedIn",
      highlightedText: "Get Your Free Guide Now",
      showBrandMark: false,
    },
  },
  "mockup-post": {
    "1": {
      title:
        "When a thing is done. It’s done. Don’t look back. Look forward to your next objective.",
      showBrandMark: false,
    },
    "2": {
      title:
        "When a thing is done. It’s done. Don’t look back. Look forward to your next objective.",
      showBrandMark: false,
    },
    "3": {
      title:
        "When a thing is done. It’s done. Don’t look back. Look forward to your next objective.",
      showBrandMark: false,
    },
    "4": {
      title:
        "When a thing is done. It’s done. Don’t look back. Look forward to your next objective.",
      showBrandMark: false,
    },
  },
  "textimg-post": {
    "1": {
      title: "Get on brand customizable<br>visuals templates in a minutes",
      highlightedText: "With an AI prompt that makes the visual for you!",
      screenshotUrl: fetchAwsAsset("screenshot", "png"),
      showBrandMark: true,
    },
    "2": {
      title: "LinkedIn CRM for Networking that Enriches your contacts.",
      subTitle: "Trusted by 5k+ Users",
      description:
        "Search, tag, find email, phone number, and recall every connection - solo or as a team",
      profilePictureUrl: "https://assets.dev.instantbranding.ai/dummy.png",
      screenshotUrl: "https://assets.dev.instantbranding.ai/screenshot.png",
      showBrandMark: true,
    },
    "3": {
      title: "How I created this <br>workflow automation",
      screenshotUrl: fetchAwsAsset("screenshot", "png"),
      showBrandMark: false,
    },
    "4": {
      title: "“ build your personal brand ”",
      description: "It's your insurance policy <br> in an uncertain world.",
      imageUrl: fetchAwsAsset("dummy", "png"),
      showBrandMark: true,
    },
    "5": {
      title: `How to rank on <span data-rte-highlight="true" data-rte-highlight-name="Rounded Highlight" style="background-color: {{highlightColor}}; color: {{primaryColor}}; padding: 0px 13px; border-radius: 13px; box-decoration-break: clone; -webkit-box-decoration-break: clone; line-height: 1.2">ChatGPT</span>`,
      imageUrl: fetchAwsAsset("dummy", "png"),
      showBrandMark: false,
    },
    "6": {
      title:
        "What no one tells you<br>about running a<br>productised design<br>service.",
      description:
        "Turns out, it’s nothing<br>like running a<br>tradition agency.",
      imageUrl: fetchAwsAsset("dummy", "png"),
      showBrandMark: true,
    },
  },
  "social-carousel": {
    default: {
      first: {
        title: "Personal Brand Strategist",
        description:
          "Helping entrepreneurs and professionals build memorable personal brands that attract opportunities and accelerate career growth.",
        imageUrl: fetchAwsAsset("dummy", "png"),
        imageAlt: "Professional headshot",
        ctaText: "SWIPE FOR MORE INSIGHTS →",
        highlightedText: "1M+ Professionals Served",
        showBrandMark: true,
      },
      middle: {
        title: "5 Personal Brand Strategies",
        subTitle: "Content That Converts",
        description:
          "Learn the proven strategies that helped me grow a memorable personal brand and generate opportunities through consistent content.",
        imageUrl: fetchAwsAsset("dummy", "png"),
        imageAlt: "Professional headshot",
        highlightedText: "Strategy #1",
        showBrandMark: true,
      },
      last: {
        title: "Ready to Build Your Personal Brand?",
        subTitle: "Let's Connect & Grow Together",
        description:
          "Join thousands of professionals who've transformed their careers through strategic personal branding. Your success story starts here.",
        imageUrl: fetchAwsAsset("dummy", "png"),
        imageAlt: "Professional headshot",
        ctaText: "CONNECT WITH ME",
        highlightedText: "Free Brand Consultation",
        buttonText: "Get Your Free Consultation",
        showBrandMark: true,
      },
    },
    "1": {
      first: {
        title: "Unlock Your Entrepreneurial Potential",
        highlightedText: "Swipe Right to Explore",
        showBrandMark: true,
      },
      middle: {
        title: "1. Define Your Idea",
        description:
          "A solid foundation starts with a well-defined idea. Spend time to research and make sure it is unique and viable.",
        screenshotUrl: fetchAwsAsset("screenshot", "png"),
        showBrandMark: true,
      },
      last: {
        title: "Ready to Start Your Journey?",
        highlightedText: "Let's Get Started!",
        showBrandMark: true,
      },
    },
    "2": {
      first: {
        title: `BENEFITS<br>OF HAVING<br><span data-rte-highlight="true" data-rte-highlight-name="Rounded Highlight" style="background-color: {{highlightColor}}; color: {{primaryColor}}; padding: 0px 13px; border-radius: 13px; box-decoration-break: clone; -webkit-box-decoration-break: clone; line-height: 1.2">A MOBILE APP</span><br>FOR YOUR BUSINESS`,
        showBrandMark: true,
      },
      middle: {
        subTitle: "Strong Brand<br>Recognition",
        screenshotUrl: fetchAwsAsset("screenshot", "png"),
        showBrandMark: true,
      },
      last: {
        title: "Need assistance for your new idea?<br>Call us",
        description: "(+91) 12345 67890",
        profilePictureUrl: "https://assets.dev.instantbranding.ai/dummy.png",
        showBrandMark: true,
      },
    },
    "3": {
      first: {
        title: `Lorem ipsum dolor tidor isumpt`,
        description:
          "Lorem ipsum dolor sit amet. Est nihil esse quo quia illum ut velit exercitaasiun.",
        profilePictureUrl: "https://assets.dev.instantbranding.ai/dummy.png",
        screenshotUrl: fetchAwsAsset("carousel-img-1", "jpg"),
        showBrandMark: true,
      },
      middle: {
        title: "Lorem ipsum",
        description: `Cum sunt dignissimos qui dolore delectus qui doloremque dolor et laboriosam quam in accusamus porro ut molestiae dolores At facere rerum.<br>
                      <br> -  Quo magni dignissimos et dolore debitis ut laudantium
                      <br> -  Repellat et alias dignissimos et quos mollitia ut ipsam aliquam et dolorem distinctio.`,
        profilePictureUrl: "https://assets.dev.instantbranding.ai/dummy.png",
        showBrandMark: true,
      },
      last: {
        title: "Lorem ipsum dolor tidor isumpt",
        description:
          "Cum sunt dignissimos qui dolore delectus qui doloremque dolor et laboriosam quam in accusamus porro ut molestiae dolores.",
        highlightedText: "Follow me for more",
        showBrandMark: true,
      },
    },
    "4": {
      first: {
        title: `Lorem ipsum dolor tidot`,
        screenshotUrl: fetchAwsAsset("carousel-img-2", "jpg"),
        showBrandMark: true,
      },
      middle: {
        title: "1. Dum sunt dignissimos qui",
        description:
          "Dm sunt dignissimos qui dolore delectus qui doloremque dolor et.",
        screenshotUrl: fetchAwsAsset("carousel-img-2", "jpg"),
        showBrandMark: true,
      },
      last: {
        title: "Et corporis neque<br>eos sint numquam",
        description: "Lorem Ipsum<br>www.loremipsum.com/contact",
        backgroundimgUrl: fetchAwsAsset("text-img-bg", "png"),
        showBrandMark: true,
      },
    },
  },
};
