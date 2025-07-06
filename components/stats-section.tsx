export function StatsSection() {
  const stats = [
    {
      value: "85-100%",
      label: "Bot accuracy on traditional CAPTCHAs",
      description: "Modern bots easily solve most CAPTCHA challenges",
    },
    {
      value: "50-85%",
      label: "Human success rates on same systems",
      description: "Humans struggle with the puzzles meant to stop bots",
    },
    {
      value: "0ms",
      label: "Time users spend solving invisible CAPTCHAs",
      description: "Seamless verification without user friction",
    },
  ]

  return (
    <section className="py-16 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The CAPTCHA Problem</h2>
          <p className="text-xl text-gray-400">Traditional CAPTCHAs create more problems than they solve</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold mb-2">{stat.label}</div>
              <div className="text-gray-400">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
