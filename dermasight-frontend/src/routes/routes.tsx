import { createBrowserRouter } from "react-router";
import Layout from "@/components/Layout";
import About from "@/pages/about/About";
import Contact from "@/pages/contact/Contact";
import Home from "@/pages/home/Home";
import Library from "@/pages/library/Library";
import LibraryDetail from "@/pages/library/LibraryDetail";
import AdminLibrary from "@/pages/library/AdminLibrary";
import Policy from "@/pages/policy/Policy";
import Profile from "@/pages/profile/Profile";
import Result from "@/pages/result/Result";
import Scan from "@/pages/scan/Scan";
import SignIn from "@/pages/sign-in/SignIn";
import SignUp from "@/pages/sign-up/SignUp";
import Terms from "@/pages/terms/Terms";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Layout,
		children: [
			{
				index: true,
				Component: Home,
			},
			{
				path: "scan",
				Component: Scan,
			},
			{
				path: "profile",
				Component: Profile,
			},
			{
				path: "library",
				Component: Library,
			},
			{
				path: "library/:slug",
				Component: LibraryDetail,
			},
			{
				path: "admin/library",
				Component: AdminLibrary,
			},
			{
				path: "result",
				Component: Result,
			},
			{
				path: "about",
				Component: About,
			},
			{
				path: "policy",
				Component: Policy,
			},
			{
				path: "terms",
				Component: Terms,
			},
			{
				path: "contact",
				Component: Contact,
			},
		],
	},
	{
		path: "sign-in",
		Component: SignIn,
	},
	{
		path: "sign-up",
		Component: SignUp,
	},
]);

export { router };
