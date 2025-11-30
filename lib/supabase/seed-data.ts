export const SAMPLE_PRODUCTS = [
  {
    id: "prod_1",
    title: "Engineering Mathematics Textbook",
    description: "Comprehensive guide for 1st year engineering students. Slightly used but in excellent condition. No markings inside.",
    price: 450,
    category: "Books",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    seller_id: "user_demo_1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: "prod_2",
    title: "Scientific Calculator FX-991EX",
    description: "Essential for exams. Solar powered, 552 functions. Comes with original cover.",
    price: 800,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1587145820266-a5951eebebb1?w=800&q=80",
    seller_id: "user_demo_2",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "prod_3",
    title: "Wireless Mouse Logitech",
    description: "Ergonomic design, long battery life. barely used.",
    price: 600,
    category: "Electronics",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    seller_id: "user_demo_1",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "prod_4",
    title: "Lab Coat - Size M",
    description: "White cotton lab coat, required for chemistry labs. Clean and ironed.",
    price: 250,
    category: "Clothing",
    image_url: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800&q=80",
    seller_id: "user_demo_3",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "prod_5",
    title: "Drafter for Engineering Drawing",
    description: "Mini drafter in perfect working condition. Includes scale and protractor.",
    price: 300,
    category: "Stationery",
    image_url: "https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=800&q=80",
    seller_id: "user_demo_2",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  }
];

export const SAMPLE_SERVICES = [
  {
    id: "serv_1",
    title: "Python Programming Tutor",
    description: "Struggling with Python assignments? I can help you understand concepts and debug code. 2 years experience.",
    price: 300,
    category: "Tutoring",
    image_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
    provider_id: "user_demo_2",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "serv_2",
    title: "Graphic Design for Posters/Events",
    description: "Professional looking posters and social media posts for your club events. Fast turnaround.",
    price: 500,
    category: "Design",
    image_url: "https://images.unsplash.com/photo-1626785774573-4b7993125486?w=800&q=80",
    provider_id: "user_demo_1",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: "serv_3",
    title: "Laptop Repair & Cleaning",
    description: "Fan cleaning, thermal paste replacement, and software troubleshooting. Keep your laptop running cool.",
    price: 400,
    category: "Tech Support",
    image_url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80",
    provider_id: "user_demo_3",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "serv_4",
    title: "Guitar Lessons for Beginners",
    description: "Learn the basics of acoustic guitar. Chords, strumming patterns, and your favorite songs.",
    price: 200,
    category: "Music",
    image_url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
    provider_id: "user_demo_1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const SAMPLE_REQUESTS = [
  {
    id: "req_1",
    title: "Need a Scientific Calculator for Exam",
    description: "Forgot mine at home. Need to borrow one for the Physics exam tomorrow (Monday). Will treat you to coffee!",
    budget_min: 0,
    budget_max: 50,
    category: "Electronics",
    urgency: "urgent",
    requester_id: "user_demo_3",
    status: "open",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "req_2",
    title: "Looking for 'Introduction to Algorithms' Book",
    description: "Does anyone have the CLRS book? Need it for reference for a few days.",
    budget_min: 0,
    budget_max: 100,
    category: "Books",
    urgency: "medium",
    requester_id: "user_demo_2",
    status: "open",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "req_3",
    title: "Ride share to City Center",
    description: "Anyone going to the city center this Saturday? Happy to split fuel costs.",
    budget_min: 100,
    budget_max: 200,
    category: "Transport",
    urgency: "low",
    requester_id: "user_demo_1",
    status: "open",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

export const SAMPLE_PROFILES = [
  {
    id: "user_demo_1",
    email: "alex@university.edu",
    full_name: "Alex Johnson",
    is_verified: true,
    rating: 4.8,
    total_reviews: 12,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "user_demo_2",
    email: "sarah@university.edu",
    full_name: "Sarah Lee",
    is_verified: true,
    rating: 4.5,
    total_reviews: 8,
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: "user_demo_3",
    email: "mike@university.edu",
    full_name: "Mike Chen",
    is_verified: false,
    rating: 0,
    total_reviews: 0,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];
