import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Page() {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';

  if (/iPhone|iPad|iOS/i.test(userAgent)) {
    redirect('https://apps.apple.com/in/app/mannu-bhai-service-expert/id6744962904');
  } else if (/Android/i.test(userAgent)) {
    redirect('https://play.google.com/store/apps/details?id=com.mannubhai.customer');
  } else {
    redirect('https://www.mannubhai.com');
  }

  return null; // Nothing is rendered
}
