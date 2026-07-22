import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-16 text-center">
      <div className="max-w-3xl space-y-6">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Simple & Fast
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Log daily expenses, track budgets, and see where your money goes in seconds.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard &rarr;
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl text-left w-full">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-4">
            ⚡
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Fast Logging</h3>
          <p className="text-sm text-slate-600 mt-2">
            Record expenses in seconds without wading through confusing menus.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mb-4">
            🏷️
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Categorization</h3>
          <p className="text-sm text-slate-600 mt-2">
            Organize spent funds into Food, Utilities, Shopping, and custom tags.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold mb-4">
            📊
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Clear Overview</h3>
          <p className="text-sm text-slate-600 mt-2">
            Keep an eye on total spending and remaining monthly budget at a glance.
          </p>
        </div>
      </div>
    </main>
  );
}