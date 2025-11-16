"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { ImageDetailPage } from '@/components/image/ImageDetailPage';

export default function ImageDetailPageWrapper() {
  const params = useParams();
  // Handle both [id] and $id parameter names
  const idParam = (params?.id || params?.$id) as string | undefined;
  const id = idParam ? Number(idParam) : null;

  if (!id) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg">Invalid image ID</p>
        </div>
      </div>
    );
  }

  return <ImageDetailPage id={id} />;
}

