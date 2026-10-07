export const metadata = { title: "Flower care" };

export default function FlowerCarePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl">Flower care</h1>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-muted">
        <li>Trim stems at an angle and place in clean water as soon as possible.</li>
        <li>Change water every 1–2 days and recut stems.</li>
        <li>Keep arrangements away from direct sun, heat and ripening fruit.</li>
        <li>Remove wilted blooms to help the rest last longer.</li>
      </ul>
    </div>
  );
}
