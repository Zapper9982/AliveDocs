'use client';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'

import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators';
import { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';



const CollaborativeRoom = ({roomId, roomMetadata}: CollaborativeRoomProps) => {
   const currentUserType = 'editor';
  const [Documenttitle, setDocumentitle] = useState(roomMetadata.title);
   const [editing , setEditing] = useState(false);
   const [Loading, setLoading] = useState(false);

   const containerRef = useRef<HTMLDivElement>(null);
   const InputRef = useRef<HTMLDivElement>(null);

   const updateTitleHandler = async (e:React.KeyboardEvent<HTMLInputElement>)=>{
      if(e.key === 'Enter'){
        setLoading(true);
        try {
          if(Documenttitle!==roomMetadata.title){
             const updatedDocument  = await updateDocument(roomId, Documenttitle);
          }
        } catch (error) {
           console.error(error);
        }

        setLoading(false);
      }
   }
   
   useEffect(()=>{ 
    const handleClickOutside = (e:MouseEvent)=>{
      if(containerRef.current && !containerRef.current.contains(e.target as Node)){
        setEditing(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);


    return ()=>{
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
   },[])

   useEffect(()=>{
    if(editing && InputRef.current){
      InputRef.current.focus();

    }
   },[editing])

  return (
    <RoomProvider id={roomId}>
    <ClientSideSuspense fallback={<div>Loading…</div>}>
     <div className='collaborative-room'>
     <Header>
            <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
               {editing && !Loading ?(
                <Input
                type='text'
                value={Documenttitle}
                ref={InputRef}
                placeholder='Enter title'
                onChange={(e)=> setDocumentitle(e.target.value)}
                onKeyDown={updateTitleHandler}
                disable={!editing}
                className='document-title-input'/>
               ): (
                <>
                <p className='document-title'>{Documenttitle}</p>
                </>
               )}
               {currentUserType==="editor" && !editing && (
                <Image
                src="/assets/icons/edit.svg"
                alt='edit'
                width={24}
                height={24}
                onClick={()=>setEditing(true)}
                className='pointer'/>
               )} 
               {currentUserType!=="editor" && !editing && (
                  <p className='view-only-tag'>View Only</p>
               )} 
               {Loading && <p className='text-sm  text-gray-400 '>saving ...</p>}
            </div>
            <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
              <ActiveCollaborators/>

            <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
            </div>
        </Header>
        <Editor/>
     </div>
    </ClientSideSuspense>
  </RoomProvider>
  )
}

export default CollaborativeRoom