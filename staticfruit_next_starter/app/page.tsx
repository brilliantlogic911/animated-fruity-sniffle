import Header from '@/components/Header'; import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function Page(){
  return (<div className='max-w-md mx-auto px-4 pb-20'>
    <Header/>
    <Card><CardHeader><CardTitle>Today’s Fruit Sign</CardTitle></CardHeader>
      <CardContent>
        <div className='text-sm'>♌ Leo • Theme: Hustle</div>
        <div className='text-xl font-semibold'>“Move quiet, stack louder — star maps in the ledger.”</div>
        <div className='flex gap-2 pt-2'><Button>Claim on Base</Button><Button className='border-white/20 bg-white/5'>Share</Button></div>
      </CardContent>
    </Card>
    <div className='h-4'/>
    <Card><CardHeader><CardTitle>Trending Bars</CardTitle></CardHeader>
      <CardContent>
        <div className='text-sm'>@luna • “On Base I move silent like gasless txns”</div>
        <div className='text-sm'>@mike • “Cold wallet pockets, warm jet streams”</div>
        <div className='pt-2'><Button className='bg-accent text-white'>Open Bars</Button></div>
      </CardContent>
    </Card>
    <BottomNav/>
  </div>);
}