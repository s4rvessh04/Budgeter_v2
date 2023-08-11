import React from "react";
import { Navbar } from "../components";
import {
	Avatar,
	Box,
	Container,
	Flex,
	Grid,
	GridItem,
	IconButton,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { axiosRequest } from "../utils";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";

export const FriendsDiscover = () => {
	const queryClient = useQueryClient();

	const {
		data: discoverData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["discover"],
		queryFn: () =>
			axiosRequest.get(`/friends/discover`).then((res) => res.data),
		refetchOnWindowFocus: false,
	});

	const addFriendMutation = useMutation({
		mutationFn: (data: any) => axiosRequest.post(`/friends/`, data),
		onSuccess: () => {
			queryClient.invalidateQueries("friends");
			queryClient.invalidateQueries("discover");
			queryClient.invalidateQueries("pendingFriends");
		},
		onError: (err) => {
			console.log(err);
		},
	});

	return (
		<Navbar>
			<Container
				minW={{
					base: "container.sm",
					lg: "container.md",
					xl: "container.xl",
				}}
				minH={{ xl: "100vh", base: "full" }}
				maxW={"full"}
				display={"flex"}
				flexDirection={"column"}
				px={{ base: 2, md: 4, lg: 4 }}
				py={{ base: 2, md: 4, lg: 4 }}
			>
				<Grid
					templateColumns={{
						base: "repeat(1, 1fr)",
						lg: "repeat(3, 1fr)",
					}}
					gap={{ base: 2, lg: 4 }}
				>
					{discoverData?.length > 0
						? discoverData?.map((data, idx) => (
								<GridItem
									key={idx}
									display={"flex"}
									border={"1px"}
									borderColor={useColorModeValue(
										"gray.200",
										"gray.700"
									)}
									rounded="lg"
									justifyContent="space-between"
									alignItems="center"
									px="4"
									py="4"
									bg={useColorModeValue("white", "gray.800")}
								>
									<Flex gap={2}>
										<Avatar
											name={data?.full_name}
											src="https://bit.ly/broken-link"
										/>
										<Box>
											<Text
												fontSize={"lg"}
												fontWeight="semibold"
												color={useColorModeValue(
													"gray.900",
													"white"
												)}
											>
												{data?.full_name}
											</Text>
											<Text
												fontSize={"smaller"}
												color="gray.500"
											>
												@{data?.username}
											</Text>
										</Box>
									</Flex>
									<IconButton
										aria-label="user-minus"
										colorScheme="green"
										variant="solid"
										icon={<HiUserAdd />}
										onClick={() =>
											addFriendMutation.mutate({
												friend: data?.id,
												status: "P",
											})
										}
									/>
								</GridItem>
						  ))
						: "No Users found!"}
				</Grid>
			</Container>
		</Navbar>
	);
};
