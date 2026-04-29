import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";
import ResetPasswordContent from "../../../components/ResetPasswordContent";

export default async function ResetPasswordPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return <ResetPasswordContent dictionary={dictionary} lang={locale} />;
}
