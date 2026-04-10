/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { collection, query, getDocs, limit, doc, setDoc, getDoc } from "firebase/firestore";
import { Heart, Shield, Users, Sparkles, MessageCircle, CheckCircle, Send } from "lucide-react";

import Layout from "./components/Layout";
import ContentPage from "./components/ContentPage";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { ScrollArea } from "./components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";

import { auth, googleProvider, signInWithPopup, db, handleFirestoreError, OperationType } from "./lib/firebase";
import { useAuth } from "./components/FirebaseProvider";
import DiscoveryCard from "./components/DiscoveryCard";
import { moderateContent } from "./services/geminiService";

const Home = () => (
  <div className="flex flex-col">
    {/* Hero Section */}
    <section className="relative py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Meaningful Connections</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-950 mb-6 leading-tight">
          Find Your <span className="text-brand-600 italic">Soul Connection</span>
        </h1>
        <p className="text-xl text-brand-800 max-w-2xl mx-auto mb-10 leading-relaxed">
          SoulLink is a safe, non-adult platform focused on building deep friendships, meaningful relationships, and professional networking through shared values and life goals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/discovery">
            <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white rounded-full px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
              Start Your Journey
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="border-brand-200 text-brand-800 rounded-full px-10 py-7 text-lg hover:bg-brand-50 w-full sm:w-auto">
              Learn Our Mission
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-30" />
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 bg-brand-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-900 mb-4">Why SoulLink?</h2>
          <p className="text-brand-700 max-w-xl mx-auto">We prioritize safety, depth, and authenticity over superficial swipes.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Safe & Non-Adult",
              desc: "Strict moderation and content policies ensure a respectful environment focused on real connections."
            },
            {
              icon: Sparkles,
              title: "AI Compatibility",
              desc: "Our AI analyzes interests and life goals to suggest matches that truly resonate with your soul."
            },
            {
              icon: Users,
              title: "Value-Based Discovery",
              desc: "Find people based on shared hobbies, professional goals, and personal values."
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-900 mb-3">{feature.title}</h3>
              <p className="text-brand-700 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <img 
            src="https://picsum.photos/seed/connection/800/600" 
            alt="Meaningful connection" 
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-serif font-bold text-brand-900">Our Commitment to Your Safety</h2>
          <p className="text-lg text-brand-800 leading-relaxed">
            At SoulLink, we believe that technology should bring people together in meaningful ways. We have built a platform that removes the "hookup culture" noise and focuses on what truly matters: shared humanity.
          </p>
          <ul className="space-y-4">
            {[
              "AI-powered content moderation",
              "Strict non-adult content policy",
              "Interest-based matching algorithms",
              "Verified profile system"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-brand-800">
                <CheckCircle className="w-5 h-5 text-brand-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Link to="/safety">
            <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-full px-8 mt-4">
              Read Our Safety Guidelines
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </div>
);

const About = () => (
  <ContentPage title="About Us">
    <p>
      SoulLink was born out of a simple observation: the digital world is more connected than ever, yet meaningful human connection is becoming harder to find. Most social and dating platforms prioritize superficial metrics, leading to a culture of temporary interactions rather than lasting bonds.
    </p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Our Mission</h2>
    <p>
      Our mission is to leverage artificial intelligence to foster deep, value-based relationships. Whether you are looking for a lifelong partner, a new best friend, or a professional mentor, SoulLink provides a safe and respectful environment to find your "soul connection."
    </p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">Why We Are Different</h2>
    <p>
      Unlike other platforms, SoulLink is strictly non-adult. We have implemented rigorous AI moderation to ensure that all interactions remain respectful and focused on shared interests, hobbies, and life goals. We believe that by removing the pressure of "hookup culture," we allow true personalities to shine.
    </p>
  </ContentPage>
);

const Contact = () => (
  <ContentPage title="Contact Us">
    <p>We value your feedback and are here to help with any questions or concerns you may have.</p>
    <div className="bg-white p-8 rounded-3xl border border-brand-100 shadow-sm mt-8">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-800">Full Name</label>
            <input type="text" className="w-full p-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-800">Email Address</label>
            <input type="email" className="w-full p-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="john@example.com" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-800">Subject</label>
          <input type="text" className="w-full p-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="How can we help?" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-800">Message</label>
          <textarea className="w-full p-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-brand-500 outline-none h-32" placeholder="Your message here..."></textarea>
        </div>
        <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white py-6 rounded-xl text-lg">
          Send Message
        </Button>
      </form>
    </div>
  </ContentPage>
);

const Privacy = () => (
  <ContentPage title="Privacy Policy">
    <p>Last Updated: April 9, 2026</p>
    <p>At SoulLink, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">1. Information We Collect</h2>
    <p>We collect information you provide directly to us, such as when you create a profile, including your name, email, interests, and life goals. We also collect data about your interactions on the platform to improve our AI matching algorithms.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">2. How We Use Your Information</h2>
    <p>We use your information to facilitate connections, moderate content for safety, and provide a personalized experience. We do not sell your personal data to third parties.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">3. Data Security</h2>
    <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
  </ContentPage>
);

const Terms = () => (
  <ContentPage title="Terms & Conditions">
    <p>By using SoulLink, you agree to the following terms and conditions.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">1. Eligibility</h2>
    <p>You must be at least 18 years old to use SoulLink. By creating an account, you represent and warrant that you meet this requirement.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">2. Prohibited Content</h2>
    <p>SoulLink is a strictly non-adult platform. Any user posting explicit, sexual, or inappropriate content will be permanently banned. Harassment, hate speech, and illegal activities are also strictly prohibited.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">3. Account Termination</h2>
    <p>We reserve the right to terminate or suspend your account at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users.</p>
  </ContentPage>
);

const Disclaimer = () => (
  <ContentPage title="Disclaimer">
    <p>The information provided on SoulLink is for general informational purposes only. While we strive to facilitate meaningful connections, we cannot guarantee the compatibility or behavior of any user.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">No Professional Advice</h2>
    <p>SoulLink does not provide relationship counseling, legal advice, or professional networking guarantees. Any actions taken based on connections made through the platform are at your own risk.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">User Responsibility</h2>
    <p>Users are solely responsible for their interactions with others. We encourage you to follow our Safety Guidelines when meeting anyone in person.</p>
  </ContentPage>
);

const Safety = () => (
  <ContentPage title="Safety Guidelines">
    <p>Your safety is our top priority. Please follow these guidelines to ensure a positive experience on SoulLink.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">1. Protect Your Information</h2>
    <p>Never share sensitive personal information, such as your home address, social security number, or financial details, with someone you just met online.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">2. Stay on the Platform</h2>
    <p>Keep conversations on SoulLink for as long as possible. Our AI moderation system is designed to protect you within our environment.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">3. Meeting in Person</h2>
    <p>If you decide to meet someone in person, always meet in a public, well-lit place. Tell a friend or family member where you are going and when you expect to return.</p>
    <h2 className="text-2xl font-serif font-bold mt-8 mb-4">4. Trust Your Instincts</h2>
    <p>If someone makes you feel uncomfortable or pressured, stop communicating with them immediately and use our Report feature.</p>
  </ContentPage>
);

const Blog = () => (
  <div className="container mx-auto px-4 py-16">
    <h1 className="text-4xl font-serif font-bold text-brand-900 mb-12 text-center">Relationship & Connection Blog</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: "How to Build Healthy Relationships",
          excerpt: "Discover the foundations of lasting bonds and mutual respect.",
          image: "https://picsum.photos/seed/healthy/600/400"
        },
        {
          title: "Communication Tips for New Friends",
          excerpt: "Master the art of listening and expressing yourself clearly.",
          image: "https://picsum.photos/seed/comm/600/400"
        },
        {
          title: "Friendship vs Love: Finding the Balance",
          excerpt: "Understanding the different types of connections in your life.",
          image: "https://picsum.photos/seed/balance/600/400"
        }
      ].map((post, i) => (
        <div key={i} className="bg-white rounded-3xl overflow-hidden border border-brand-100 shadow-sm hover:shadow-md transition-shadow">
          <img src={post.image} alt={post.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
          <div className="p-6">
            <h3 className="text-xl font-serif font-bold text-brand-900 mb-3">{post.title}</h3>
            <p className="text-brand-700 text-sm mb-4">{post.excerpt}</p>
            <Button variant="link" className="text-brand-600 p-0 h-auto font-bold">Read More →</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/discovery");
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Welcome to SoulLink!");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Failed to login. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-brand-100 text-center max-w-md w-full">
        <Heart className="w-16 h-16 text-brand-500 fill-brand-500 mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-bold text-brand-900 mb-4">Join SoulLink</h1>
        <p className="text-brand-700 mb-8 leading-relaxed">
          Create an account to start finding meaningful connections based on your values and goals.
        </p>
        <Button 
          onClick={handleLogin}
          className="w-full bg-white text-brand-900 border-2 border-brand-100 hover:bg-brand-50 py-7 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
          Continue with Google
        </Button>
        <p className="mt-8 text-xs text-brand-400">
          By continuing, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

const Discovery = () => {
  const { user, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  const categories = ["All", "Travel", "Study", "Business", "Fitness", "Gaming", "Art"];

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const q = query(collection(db, "users"), limit(10));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (data.length === 0) {
          setProfiles([
            {
              displayName: "Sarah Chen",
              bio: "Passionate about sustainable tech and hiking. Looking for deep conversations about the future of our planet.",
              interests: ["Travel", "Business", "Art"],
              lifeGoals: "To build a startup that solves water scarcity.",
              photoURL: "https://picsum.photos/seed/sarah/600/800",
              compatibility: 94
            },
            {
              displayName: "Marcus Thorne",
              bio: "History buff and amateur astronomer. I believe in lifelong learning and meaningful friendships.",
              interests: ["Study", "Gaming", "Art"],
              lifeGoals: "To visit every historical site in Europe.",
              photoURL: "https://picsum.photos/seed/marcus/600/800",
              compatibility: 88
            },
            {
              displayName: "Elena Rodriguez",
              bio: "Yoga instructor and plant lover. Seeking a partner for mindful living and weekend adventures.",
              interests: ["Fitness", "Travel", "Art"],
              lifeGoals: "To open a community wellness center.",
              photoURL: "https://picsum.photos/seed/elena/600/800",
              compatibility: 82
            }
          ]);
        } else {
          setProfiles(data);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "users");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchProfiles();
  }, [authLoading]);

  if (authLoading || loading) return <div className="p-20 text-center font-serif text-2xl text-brand-400">Finding connections...</div>;
  if (!user) return <Login />;

  const filteredProfiles = category === "All" 
    ? profiles 
    : profiles.filter(p => p.interests?.includes(category));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-900 mb-2">Discover Connections</h1>
          <p className="text-brand-600">Find people who share your vision and values.</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-6 ${category === cat ? "bg-brand-600 hover:bg-brand-700" : "border-brand-200 text-brand-700"}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProfiles.map((profile, i) => (
          <DiscoveryCard 
            key={i} 
            user={profile} 
            onConnect={() => {
              toast.success(`Connection request sent to ${profile.displayName}!`);
              return "";
            }} 
          />
        ))}
      </div>
    </div>
  );
};

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isModerating, setIsModerating] = useState(false);

  const mockMessages = [
    { id: 1, senderId: "other", text: "Hi! I saw your profile and loved your life goals.", createdAt: new Date() },
    { id: 2, senderId: "me", text: "Thanks! I'm really passionate about sustainable tech.", createdAt: new Date() },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isModerating) return;

    setIsModerating(true);
    try {
      const moderation = await moderateContent(newMessage);
      if (!moderation.isSafe) {
        toast.error(`Message blocked: ${moderation.reason || "Inappropriate content detected."}`);
        return;
      }

      setMessages([...messages, { id: Date.now(), senderId: "me", text: newMessage, createdAt: new Date() }]);
      setNewMessage("");
      toast.success("Message sent!");
    } catch (error) {
      toast.error("Failed to send message.");
    } finally {
      setIsModerating(false);
    }
  };

  if (!user) return <Login />;

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-120px)] flex gap-6">
      <div className="hidden md:flex flex-col w-80 bg-white rounded-3xl border border-brand-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-brand-50">
          <h2 className="text-xl font-serif font-bold text-brand-900">Messages</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {[
              { name: "Sarah Chen", lastMsg: "That sounds amazing!", time: "2m ago", active: true },
              { name: "Marcus Thorne", lastMsg: "Have you seen the new...", time: "1h ago", active: false },
            ].map((chat, i) => (
              <div key={i} className={`p-4 rounded-2xl cursor-pointer transition-colors ${chat.active ? 'bg-brand-50 border border-brand-100' : 'hover:bg-brand-50'}`}>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://picsum.photos/seed/${chat.name}/100`} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-brand-900 truncate">{chat.name}</p>
                      <span className="text-[10px] text-brand-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-brand-500 truncate">{chat.lastMsg}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-brand-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-brand-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/sarah/100" />
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-brand-900">Sarah Chen</p>
              <p className="text-[10px] text-brand-400 uppercase tracking-wider font-bold">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-brand-400 hover:text-brand-600">
            <Shield className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {[...mockMessages, ...messages].map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                  msg.senderId === 'me' 
                    ? 'bg-brand-600 text-white rounded-tr-none' 
                    : 'bg-brand-50 text-brand-900 rounded-tl-none border border-brand-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-brand-50 flex gap-3">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a respectful message..."
            className="flex-1 rounded-full bg-brand-50 border-none focus-visible:ring-brand-500"
            disabled={isModerating}
          />
          <Button 
            type="submit" 
            disabled={isModerating}
            className="bg-brand-600 hover:bg-brand-700 text-white rounded-full w-12 h-12 p-0 flex items-center justify-center"
          >
            {isModerating ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          const newProfile = {
            uid: user.uid,
            displayName: user.displayName || "New User",
            email: user.email,
            photoURL: user.photoURL,
            bio: "",
            interests: [],
            lifeGoals: "",
            createdAt: new Date().toISOString(),
            isVerified: false
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (!user) return <Login />;
  if (!profile) return <div className="p-20 text-center font-serif text-2xl text-brand-400">Loading profile...</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="bg-white rounded-[3rem] border border-brand-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-brand-100 relative">
          <div className="absolute -bottom-12 left-8">
            <Avatar className="w-24 h-24 border-4 border-white shadow-md">
              <AvatarImage src={profile.photoURL} />
              <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="pt-16 p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-brand-900">{profile.displayName}</h1>
              <p className="text-brand-500">{profile.email}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-full border-brand-200 text-brand-600"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input 
                  value={profile.displayName} 
                  onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                  className="rounded-xl border-brand-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <textarea 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full p-3 rounded-xl border border-brand-100 focus:ring-2 focus:ring-brand-500 outline-none h-24 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Life Goals</Label>
                <textarea 
                  value={profile.lifeGoals} 
                  onChange={(e) => setProfile({...profile, lifeGoals: e.target.value})}
                  className="w-full p-3 rounded-xl border border-brand-100 focus:ring-2 focus:ring-brand-500 outline-none h-24 text-sm"
                />
              </div>
              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white py-6 rounded-xl">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-400">About Me</h3>
                <p className="text-brand-800 leading-relaxed">{profile.bio || "No bio yet."}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-400">Life Goals</h3>
                <p className="text-brand-800 italic">"{profile.lifeGoals || "No goals listed yet."}"</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-brand-400">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.length > 0 ? profile.interests.map((int: string) => (
                    <Badge key={int} className="bg-brand-50 text-brand-700 border-brand-100">{int}</Badge>
                  )) : <p className="text-brand-400 text-sm italic">No interests added.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="safety" element={<Safety />} />
          <Route path="blog" element={<Blog />} />
          <Route path="discovery" element={<Discovery />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
