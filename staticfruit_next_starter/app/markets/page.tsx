import Header from '@/components/Header'; import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Button } from '@/components/ui/button';
export default async function Page(){
  const markets = [{id:1,title:'Nicki surprise collab by Oct 31?',yes:0.62},{id:2,title:'TikTok sound hits 100k in 7 days?',yes:0.44}];
  return (<div className='max-w-md mx-auto px-4 pb-20'><Header/>
    {markets.map(m => (<Card key={m.id} className='mb-4'><CardHeader><CardTitle>{m.title}</CardTitle></CardHeader>
      <CardContent><div className='text-sm'>Odds (demo): YES {(m.yes*100).toFixed(0)}% • NO {(100-m.yes*100).toFixed(0)}%</div>
        <div className='flex gap-2 pt-2'><Button>Back YES</Button><Button className='border-white/20 bg-white/5'>Back NO</Button></div>
      </CardContent></Card>))}
    <BottomNav/></div>);
}