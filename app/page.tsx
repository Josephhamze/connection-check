import { submitMessage } from "./actions";
import { getMessages, type ConnectionMessage } from "../lib/supabase";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string; sent?: string }>;
};

const services = [
  { name: "GitHub", detail: "Source code published", mark: "GH" },
  { name: "Supabase", detail: "Postgres read and write", mark: "SB" },
  { name: "Vercel", detail: "Production deployment", mark: "VC" },
];

export default async function Home({ searchParams }: PageProps) {
  const query = await searchParams;
  let messages: ConnectionMessage[] = [];
  let databaseError = "";

  try {
    messages = await getMessages();
  } catch (error) {
    databaseError = error instanceof Error ? error.message : "Database unavailable";
  }

  const supabaseConnected = Boolean(process.env.SUPABASE_URL) && !databaseError;
  const sourceUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/Josephhamze";

  return (
    <main>
      <section className="shell">
        <header>
          <p className="wordmark">connection/check</p>
          <h1>Three services.<br />One working project.</h1>
          <p className="lede">
            This page is deployed from GitHub on Vercel and reads and writes live data through Supabase.
          </p>
        </header>

        <div className="status-list" aria-label="Connection statuses">
          {services.map((service) => {
            const connected = service.name !== "Supabase" || supabaseConnected;
            return (
              <div className="status-row" key={service.name}>
                <span className="service-mark" aria-hidden="true">{service.mark}</span>
                <span className="service-copy">
                  <strong>{service.name}</strong>
                  <small>{service.detail}</small>
                </span>
                <span className={connected ? "state connected" : "state pending"}>
                  <i /> {connected ? "Connected" : "Pending setup"}
                </span>
              </div>
            );
          })}
        </div>

        <section className="message-section">
          <div className="section-heading">
            <div>
              <h2>Write a test message</h2>
              <p>The message is stored in a real Postgres table.</p>
            </div>
            <span className="counter">160 max</span>
          </div>

          <form action={submitMessage}>
            <label htmlFor="message">Message</label>
            <div className="form-row">
              <input id="message" name="message" maxLength={160} placeholder="Hello from the live app" required />
              <button type="submit" disabled={!supabaseConnected}>Send to Supabase</button>
            </div>
          </form>

          {(query.error || databaseError) && <p className="notice error">{query.error ?? databaseError}</p>}
          {query.sent && <p className="notice success">Message saved and read back successfully.</p>}

          <div className="recent">
            <h3>Recent messages</h3>
            {messages.length ? (
              <ul>
                {messages.map((message) => (
                  <li key={message.id}>
                    <span>{message.body}</span>
                    <time dateTime={message.created_at}>
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.created_at))}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">No messages yet. Send the first one after Supabase is connected.</p>
            )}
          </div>
        </section>

        <footer>
          <a href={sourceUrl} target="_blank" rel="noreferrer">View source on GitHub ↗</a>
          <span>Deployed with Vercel</span>
        </footer>
      </section>
    </main>
  );
}
