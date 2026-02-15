import React from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { UserPlus } from "lucide-react";

import { Navbar } from "../components";
import { axiosRequest } from "../utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const FriendsDiscover = () => {
	const queryClient = useQueryClient();

	const {
		data: discoverData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["discover"],
		queryFn: () =>
			axiosRequest.get(`/friends/discover`).then((res) => res.data?.results ?? res.data),
		refetchOnWindowFocus: false,
	});

	const addFriendMutation = useMutation({
		mutationFn: (data: any) => axiosRequest.post(`/friends/`, data),
		onSuccess: () => {
			queryClient.invalidateQueries("friends");
			queryClient.invalidateQueries("discover");
			queryClient.invalidateQueries("pendingFriends");
		},
		onError: (err: any) => {
			// Silently handle
		},
	});

	return (
		<Navbar>
			<div className="container mx-auto p-4 max-w-5xl">
				<h1 className="text-2xl font-bold mb-6">Discover Friends</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{discoverData?.length > 0 ? (
						discoverData?.map((data: any, idx: number) => (
							<div
								key={idx}
								className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
							>
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarImage src="https://bit.ly/broken-link" alt={data?.full_name} />
										<AvatarFallback>{data?.full_name?.charAt(0)}</AvatarFallback>
									</Avatar>
									<div className="overflow-hidden">
										<p className="font-semibold text-lg truncate">{data?.full_name}</p>
										<p className="text-xs text-muted-foreground truncate">@{data?.username}</p>
									</div>
								</div>
								<Button
									size="icon"
									variant="default"
									className="bg-green-600 hover:bg-green-700 h-8 w-8"
									onClick={() =>
										addFriendMutation.mutate({
											friend: data?.id,
											status: "P",
										})
									}
								>
									<UserPlus className="h-4 w-4" />
								</Button>
							</div>
						))
					) : (
						<div className="col-span-full text-center text-muted-foreground py-10">
							No Users found!
						</div>
					)}
				</div>
			</div>
		</Navbar>
	);
};
