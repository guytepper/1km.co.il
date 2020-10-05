import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProtest } from '../api';

export default function ProtestPage() {
    const { id} = useParams();

    useEffect(() => {
        fetchProtest(id);
    },[id])
    console.log('here')
    return <div>hello</div>

}
