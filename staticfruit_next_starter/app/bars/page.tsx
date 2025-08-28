'use client'; import Header from '@/components/Header'; import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; import { Textarea } from '@/components/ui/textarea'; import { useState } from 'react';
export default function Page(){
  const [text, setText] = useState('');
  return (<div className='max-w-md mx-auto px-4 pb-20'><Header/>
    <Card><CardHeader><CardTitle>Drop a Juice Bar</CardTitle></CardHeader>
      <CardContent>
        <Textarea maxLength={280} value={text} onChange={e=>setText(e.target.value)} placeholder='Drop your 280‑char punchline…'/>
        <div className='flex gap-2'><Button>Mint Bar</Button><Button className='border-white/20 bg-white/5'>AI Punch‑Up</Button></div>
      </CardContent>
    </Card>
    <BottomNav/></div>);
}