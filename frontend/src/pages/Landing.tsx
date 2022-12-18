import { Button } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { useLocation } from "wouter";

export const Landing = () => {
	const [location, setLocation] = useLocation();
	// const [cookies, setCookie, removeCookie] = useCookies([
	// 	"token",
	// 	"logged_in",
	// ]);

	// // React.useEffect(() => {
	// // 	setCookie("logged_in", cookies?.logged_in === true ? true : false);
	// // }, []);

	// const { data, error, status } = useQuery(
	// 	["validity-data"],
	// 	() =>
	// 		axios.get("http://localhost:8000/api/auth/validate/", {
	// 			headers: {
	// 				Authorization: `Token ${cookies?.token}`,
	// 			},
	// 		}),
	// 	{
	// 		onError(err) {
	// 			console.log(err);
	// 			setCookie("logged_in", false, { path: "/" });
	// 		},
	// 		onSuccess(data) {
	// 			setCookie("logged_in", true, { path: "/" });
	// 		},
	// 	}
	// );
	// console.log(cookies.logged_in, data);
	return (
		<div>
			Landing page
			<Button onClick={() => setLocation("/login")}>Login</Button>
		</div>
	);
};
