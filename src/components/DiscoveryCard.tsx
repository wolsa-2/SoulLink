import * as React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Heart, MessageCircle, Sparkles } from 'lucide-react';

interface DiscoveryCardProps {
  user: {
    displayName: string;
    bio: string;
    interests: string[];
    skills?: string[];
    personalityTraits?: string[];
    lifeGoals: string;
    photoURL?: string;
    compatibility?: number;
  };
  onConnect: () => void;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ user, onConnect }) => {
  return (
    <Card className="overflow-hidden rounded-3xl border-brand-100 shadow-sm hover:shadow-md transition-all group">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-100">
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-300">
            <User className="w-20 h-20" />
          </div>
        )}
        
        {user.compatibility && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-bold text-brand-900">{user.compatibility}%</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-2xl font-serif font-bold text-brand-900 mb-2">{user.displayName}</h3>
        <p className="text-brand-700 text-sm line-clamp-2 mb-4">{user.bio}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {user.interests.slice(0, 2).map((interest) => (
            <Badge key={interest} variant="secondary" className="bg-brand-100 text-brand-700 border-none">
              {interest}
            </Badge>
          ))}
          {user.skills?.slice(0, 1).map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 border-none">
              {skill}
            </Badge>
          ))}
          {user.personalityTraits?.slice(0, 1).map((trait) => (
            <Badge key={trait} variant="secondary" className="bg-purple-50 text-purple-700 border-none">
              {trait}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-brand-400">Life Goals</p>
          <p className="text-xs text-brand-600 italic line-clamp-1">"{user.lifeGoals}"</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button 
          onClick={onConnect}
          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white rounded-full gap-2"
        >
          <Heart className="w-4 h-4" />
          Connect
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full border-brand-200 text-brand-600 hover:bg-brand-50"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default DiscoveryCard;
