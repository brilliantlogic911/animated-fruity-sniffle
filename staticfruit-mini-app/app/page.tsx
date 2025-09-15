import Header from '@/components/Header'; import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Page(){
  return (<div className='max-w-md mx-auto px-4 pb-20'>
    <Header/>
    
    <Card className='bg-charcoal border-gray-700'><CardHeader><CardTitle className='text-neon font-orbitron'>Today’s Fruit Sign</CardTitle></CardHeader>
      <CardContent>
        <div className='text-sm text-silver'>♌ Leo • Theme: Hustle</div>
        <div className='text-xl font-semibold text-white font-space'>“Move quiet, stack louder — star maps in the ledger.”</div>
        <div className='flex gap-2 pt-2'><Button className='bg-primary hover:bg-neon text-space font-bold'>Claim on Base</Button><Button className='border-silver bg-charcoal hover:bg-gray-600 text-white'>Share</Button></div>
      </CardContent>
    </Card>
    <div className='h-4'/>
    <Card className='bg-charcoal border-gray-700'><CardHeader><CardTitle className='text-accent font-orbitron'>Trending Bars</CardTitle></CardHeader>
      <CardContent>
        <div className='text-sm text-silver'>@luna • “On Base I move silent like gasless txns”</div>
        <div className='text-sm text-silver'>@mike • “Cold wallet pockets, warm jet streams”</div>
        <div className='pt-2'><Button className='bg-accent hover:bg-gold text-space font-bold'>Open Bars</Button></div>
      </CardContent>
    </Card>
    <BottomNav/>
  </div>);
}