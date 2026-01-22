import { getCompanyNames } from '@/lib/data-loader';

export async function generateStaticParams() {
  const companies = getCompanyNames();
  
  // Filter out 'default' company as it's handled by the root route
  return companies
    .filter(company => company !== 'default')
    .map((company) => ({
      company: company,
    }));
}

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ company: string }>;
}) {
  await params; // Await params even if not using it
  return <>{children}</>;
}
