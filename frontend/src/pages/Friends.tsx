import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Check, Search, UserMinus, X } from "lucide-react";

import { Navbar } from "../components";
import { axiosRequest } from "../utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export const Friends = () => {
	const [searchData, setSearchData] = React.useState<any>("");
	const queryClient = useQueryClient();

	const {
		data: friendsData,
		isLoading: friendsLoading,
	} = useQuery({
		queryKey: ["friends"],
		queryFn: () => axiosRequest.get(`/friends`).then((res) => res.data),
		refetchOnWindowFocus: false,
	});

	const {
		data: pendingFriends,
		isLoading: pendingFriendsLoading,
	} = useQuery({
		queryKey: ["pendingFriends"],
		queryFn: () =>
			axiosRequest.get(`/friends/pending`).then((res) => res.data?.results ?? res.data),
		refetchOnWindowFocus: false,
	});

	const acceptFriendMutation = useMutation({
		mutationFn: (data: any) =>
			axiosRequest.put(`/friends/${data.id}/update`, data.payload),
		onSuccess: () => {
			queryClient.invalidateQueries("friends");
			queryClient.invalidateQueries("pendingFriends");
		},
	});

	const removeFriendmutation = useMutation({
		mutationFn: (data: any) =>
			axiosRequest.delete(`/friends/${data.id}/delete`, data.payload),
		onSuccess: () => {
			queryClient.invalidateQueries("friends");
			queryClient.invalidateQueries("pendingFriends");
		},
	});

	return (
		<Navbar>
			<div className="container mx-auto p-4 max-w-5xl">
				<div className="flex justify-center mb-6">
					<div className="relative w-full md:w-1/2">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search friends..."
							className="pl-9"
							value={searchData}
							onChange={(e) => setSearchData(e.target.value)}
						/>
					</div>
				</div>

				{pendingFriends?.length > 0 && (
					<div className="mb-8 rounded-xl bg-muted/50 p-6">
						<h2 className="mb-4 text-xl font-semibold ml-2">New Requests!</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{pendingFriends?.map((data: any, idx: number) => (
								<div
									key={idx}
									className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
								>
									<div className="flex items-center gap-3">
										<Avatar>
											<AvatarImage src="https://bit.ly/broken-link" alt={data?.user?.full_name} />
											<AvatarFallback>{data?.user?.full_name?.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="overflow-hidden">
											<p className="font-semibold text-lg truncate">{data?.user?.full_name}</p>
											<p className="text-xs text-muted-foreground truncate">@{data?.user?.username}</p>
										</div>
									</div>
									<div className="flex gap-2">
										<Button
											size="icon"
											variant="default"
											className="bg-green-600 hover:bg-green-700 h-8 w-8"
											onClick={() =>
												acceptFriendMutation.mutate({
													id: data?.id,
													payload: {
														friend: data?.friend?.id,
														status: "A",
													},
												})
											}
										>
											<Check className="h-4 w-4" />
										</Button>
										<Button
											size="icon"
											variant="secondary"
											className="h-8 w-8"
											onClick={() =>
												removeFriendmutation.mutate({
													id: data?.id,
													payload: {
														friend: data?.user?.id,
														status: "R",
													},
												})
											}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{friendsData?.length > 0 ? (
						friendsData?.map((data: any, idx: number) => (
							<div
								key={idx}
								className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm"
							>
								<div className="flex items-center gap-3">
									<Avatar>
										<AvatarImage src="https://bit.ly/broken-link" alt={data?.friend?.full_name} />
										<AvatarFallback>{data?.friend?.full_name?.charAt(0)}</AvatarFallback>
									</Avatar>
									<div className="overflow-hidden">
										<p className="font-semibold text-lg truncate">{data?.friend?.full_name}</p>
										<p className="text-xs text-muted-foreground truncate">@{data?.friend?.username}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{/* Status badge could be here but data.friend.status might be internal id or string */}
									<Button
										size="icon"
										variant="destructive"
										className="h-8 w-8"
										onClick={() =>
											removeFriendmutation.mutate({
												id: data?.id,
												payload: {
													friend: data?.friend?.id,
													status: "R",
												},
											})
										}
									>
										<UserMinus className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))
					) : (
						<div className="col-span-full text-center text-muted-foreground py-10">
							No Friends found!
						</div>
					)}
				</div>
			</div>
		</Navbar>
	);
};
