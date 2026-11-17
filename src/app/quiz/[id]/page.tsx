export default async function QuizDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { redirect } = await import("next/navigation");
  redirect(`/quiz/${id}/play`);
}
