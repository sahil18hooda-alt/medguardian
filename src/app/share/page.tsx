
import { Suspense } from 'react';
import SharePage from './SharePage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SharePage />
    </Suspense>
  );
}
