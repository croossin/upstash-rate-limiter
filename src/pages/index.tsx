import { ratelimiter } from "@/utils/ratelimiter";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";

export default function Home({
  limited,
  remaining,
  ip,
}: {
  limited: boolean;
  remaining?: number;
  ip?: string;
}) {
  return (
    <>
      <Head>
        <title>Upstash Rate Limiter</title>
        <meta
          name="description"
          content="Limit users with upstash rate limiter"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="isolate bg-white ">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor={limited ? "#E74C3C" : "#1ABC9C"} />
                <stop offset={1} stopColor={limited ? "#C0392B" : "#2ECC71"} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <main className="h-screen -mb-8">
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              <div className="mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  This demo is part of a blog post.{" "}
                  <a
                    href="https://roo.app/articles/upstash-rate-limiter"
                    className="font-semibold text-indigo-600"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  <span
                    className={clsx(
                      "font-extrabold text-transparent  bg-clip-text bg-gradient-to-r",
                      limited
                        ? "from-red-400 to-red-600"
                        : "from-green-400 to-green-600"
                    )}
                  >
                    {remaining} Remaining
                  </span>
                  <br />
                  Upstash rate limiter
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Refresh this page 3 times within 10 seconds and you will see
                  it turn a different color, signifinying you are rate limited
                </p>
                {ip && (
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Based on IP:
                    <br />
                    <code className="font-bold">{ip}</code>
                  </p>
                )}
              </div>
            </div>
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
              <svg
                className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
                viewBox="0 0 1155 678"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                  fillOpacity=".3"
                  d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                />
                <defs>
                  <linearGradient
                    id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                    x1="1155.49"
                    x2="-78.208"
                    y1=".177"
                    y2="474.645"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={limited ? "#E74C3C" : "#1ABC9C"} />
                    <stop
                      offset={1}
                      stopColor={limited ? "#C0392B" : "#2ECC71"}
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </main>
        <footer className="mx-auto text-center">
          <div className="text-slate-500">
            Made with 🖤{" "}
            <a href="https://roo.app" target="_blank" rel="noreferrer">
              roo.app
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const forwarded = req.headers["x-forwarded-for"];

    const ip =
      typeof forwarded === "string"
        ? forwarded.split(/, /)[0]
        : req.socket.remoteAddress;

    const { success, remaining } = await ratelimiter.limit(ip!);

    return {
      props: {
        limited: !success,
        ip: ip,
        remaining,
      },
    };
  } catch (error) {
    return {
      props: {
        limited: false,
      },
    };
  }
};
