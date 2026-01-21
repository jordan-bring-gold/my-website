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

export default function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { company: string };
}) {
  return <>{children}</>;
}
