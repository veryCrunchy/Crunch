import { signIn, signOut, useSession } from "next-auth/react";

interface Options {
  screen?: boolean;
}

const UserGreeting: React.FC<Options> = (props: Options) => {
  const { data: sessionData } = useSession();

  return (
    <div
      className={
        "flex items-center justify-center " +
        (props.screen ? "w-screen" : "w-fit")
      }
    >
      <div className="container flex items-center justify-center px-4">
        <div className="xs:max-w-1xl w-full max-w-sm select-none bg-white/50 bg-clip-text pb-5 text-5xl font-extrabold tracking-tight text-transparent sm:max-w-[38rem] lg:max-w-3xl ">
          <div className="truncate text-[12vw] xs:text-5xl md:text-6xl lg:text-[5rem]">
            {(sessionData && (
              <h1 className="truncate">
                <span className="text-[8vw] xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  Hello,
                </span>
                <br></br>
                {sessionData.user?.name}
              </h1>
            )) || <h1>veryCrunchyDev</h1>}
          </div>
          <div className="mt-5 flex justify-between">
            <p className="bg-none pr-2 text-[7vw] text-red-700 opacity-20 xs:text-3xl md:text-3xl">
              this site is a w.i.p.
            </p>
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGreeting;

const SignIn: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <button
      className="whitespace-nowrap rounded-full bg-white/10 px-[6vw] py-[calc(5px+2vw)] text-[calc(5px+2.5vw)] font-semibold text-white no-underline transition hover:bg-white/20 xs:px-6 xs:py-2 xs:text-lg sm:text-lg"
      onClick={
        sessionData ? () => void signOut() : () => void signIn("discord")
      }
    >
      {sessionData ? "Sign out" : "Sign in"}
    </button>
  );
};
