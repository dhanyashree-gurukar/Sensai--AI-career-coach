"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Send, SquarePen } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import EmptyState from '../_components/empty-state';
import ReactMarkdown from "react-markdown";
import axios  from "axios";
import { useParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

function AiChat() {

    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageList, setMessageList] = useState([]);
    const { chatid } = useParams();
    const router = useRouter();
    const hasLoadedInitially = useRef(false); //
    console.log(chatid);

    useEffect(() => {
        if (typeof chatid === 'string' && chatid.length > 0) {
            GetMessageList();
        } 
    }, [chatid])

    const GetMessageList = async () => {
        const result = await axios.get('/api/history?recordId=' + chatid);
        console.log(result.data);
        setMessageList(result?.data?.content || [])
    }

    const onSend = async() => {
        setLoading(true);
        setMessageList(prev =>[...prev,{
            content: userInput,
            role: 'user',
            type: 'text'
        }])
        setUserInput('');
        const result = await axios.post('/api/ai-career-chat-agent', {
            userInput: userInput
        });
        console.log(result.data);
        setMessageList(prev=>[...prev, result.data])
        setLoading(false);
    }

   {/* useEffect(() => {
        if (messageList.length > 0 && chatid) {
            updateMessageList();
        }
    }, [messageList])*/}

    useEffect(() => {

        if (!hasLoadedInitially.current) {
            hasLoadedInitially.current = true;
            return;
        }

        if (messageList.length > 0 && typeof chatid === 'string') {
            const lastMsg = messageList[messageList.length - 1];
            if (lastMsg?.role === 'user' || lastMsg?.role === 'assistant') {
                updateMessageList();
            }
        }
    }, [messageList, chatid]); 

    const updateMessageList = async () => {
        const result = await axios.put('/api/history', {
            content: messageList,
            recordId: chatid
        });
        console.log(result);
    }

    const onNewChat = async () => {
        const id = uuidv4();
        const result = await axios.post("/api/history", {
            recordId: id,
            content: []
        });
        console.log(result);
        router.replace('/ai-chat/' + id);
    }

    return (
        <div className='px-10 md:px-12 lg:px-24 xl:px-36'>
            <div className="flex items-center justify-between gap-8">
                <div>
                    <h2 className="text-5xl font-bold md:text-4xl lg:text-5xl xl:text-6xl gradient-title">AI Career Q/A Chat</h2>
                    <p className="text-md">Smarter career decisions start here - get tailored advice, real-time market insights.</p>
                </div>
                <Button onClick={onNewChat}><SquarePen />New Chat</Button>
            </div>

            <div className='border border-gray-300 rounded-xl shadow-sm p-6 flex flex-col h-[90vh] mt-8'>
                {messageList?.length<=0 && 
                    <div className='mt-5'>
                        <EmptyState selectedQuestion={(question)=>setUserInput(question)}/>
                    </div>
                }

                <div className='flex-1 overflow-y-auto mb-4'>
                    {messageList?.map((message, index) => (
                        <div key={index}>
                            <div className={`flex mb-2 ${message.role == 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg gap-2 ${message.role=='user'?'bg-gray-600 text-white rounded-lg':
                                    "bg-gray-800 text-white"
                                }`}>
                                    <ReactMarkdown >
                                        {message.content}
                                    </ReactMarkdown>                                    
                                </div>
                            </div>
                            {loading && messageList?.length-1==index && <div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-800 text-whitemb-2'>
                                <LoaderCircle className='animate-spin'/> Thinking...
                            </div>}
                        </div>
                    ))}
                </div>

                <div className='flex justify-between items-center gap-4 mt-auto'>
                    <Input placeholder='Type here'value={userInput}
                    onChange={(event) => setUserInput(event.target.value)} className="h-12"/>
                    <Button onClick={onSend} disabled={loading} className="h-12"> <Send /> </Button>
                </div>
            </div>
        </div>
    )
}

export default AiChat;