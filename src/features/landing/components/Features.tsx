import FeaturesIlustration from "./FeaturesIlustration";

export default function Features() {

  return (
    <section className="max-w-6xl mx-4 lg:mx-auto py-30 border-x border-input/60 relative">
      <div className="px-4 relative">
        <div className="absolute left-0 top-1 block h-6 w-0.5 bg-primary lg:top-3.5" />
        <h2 className="text-3xl font-medium leading-snug tracking-tight sm:tracking-normal md:text-4xl md:leading-12.5 max-w-[80%] lg:max-w-3xl">
          One platform for your entire knowledge stack.{" "}
          <span className="text-muted-foreground">
            Agents that keep work moving 24/7.
          </span>
        </h2>
      </div>

      <FeaturesIlustration />
    </section>
  )
}
