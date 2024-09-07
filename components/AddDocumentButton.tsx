"use client";
import { createDocument } from '@/lib/actions/room.actions';
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const AddDocumentButton = ({userId , email}: AddDocumentBtnProps) => {
    const router = useRouter();
    const addDocumenthandler=async ()=>{
       try {
        const room  = await createDocument({userId , email});
        if(room){
           router.push(`/documents/${room.id}`);
        }
       } catch (error) {
        
       }
    }
  return (
   <Button type="submit" onClick={addDocumenthandler} className='gradient-blue flex gap-1 shadow-md'>
    <Image 
    src="/assets/icons/add.svg"
    alt='Add Document'
    width={24}
    height={24}
     />
    <p className='hidden sm:block'>Start a Blank Document</p>
   </Button>
  )
}

export default AddDocumentButton