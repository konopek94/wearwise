import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";
import ClosetDashboard from "../../../components/ClosetDashboard";
import { createServerClientSide } from "../../../lib/supabase-server";

export default async function ClosetPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const supabase = await createServerClientSide();
  
  const { data: items } = await supabase
    .from('closet_items')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-surface py-24 px-6">
      <ClosetDashboard initialItems={items || []} dictionary={dictionary} lang={locale} />
    </div>
  );
}
