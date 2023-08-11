import React from "react";
import {
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	FormControl,
	Grid,
	GridItem,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { Navbar } from "../components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosRequest } from "../utils";
import {
	HiOutlineCheck,
	HiOutlineX,
	HiSearch,
	HiUserRemove,
	HiX,
} from "react-icons/hi";

export const Friends = () => {
	const [searchData, setSearchData] = React.useState<any>("");

	const queryClient = useQueryClient();

	const {
		data: friendsData,
		isLoading: friendsLoading,
		error: friendsError,
	} = useQuery({
		queryKey: ["friends"],
		queryFn: () => axiosRequest.get(`/friends`).then((res) => res.data),
		refetchOnWindowFocus: false,
	});

	const {
		data: pendingFriends,
		isLoading: pendingFriendsLoading,
		error: pendingFriendsError,
	} = useQuery({
		queryKey: ["pendingFriends"],
		queryFn: () =>
			axiosRequest.get(`/friends/pending`).then((res) => res.data),
		refetchOnWindowFocus: false,
	});

	console.log(friendsData, pendingFriends);

	const acceptFriendMutation = useMutation({
		mutationFn: (data: any) =>
			axiosRequest.put(`/friends/${data.id}/update`, data.payload),
		onSuccess: () => {
			queryClient.invalidateQueries("friends");
			queryClient.invalidateQueries("pendingFriends");
		},
		onError: (err) => {
			console.log(err);
		},
	});
	const removeFriendmutation = useMutation({
		mutationFn: (data: any) =>
			axiosRequest.delete(`/friends/${data.id}/delete`, data.payload),
		onSuccess: () => {
			queryClient.invalidateQueries("friends");
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
				<FormControl
					w={{ base: "full", lg: "50%" }}
					justifyItems="center"
					mb={{ base: "4", lg: "6" }}
					display="flex"
					gap={2}
				>
					<InputGroup>
						<InputLeftElement
							pointerEvents={"none"}
							children={<HiSearch />}
						/>
						<Input
							type={"search"}
							value={searchData}
							placeholder="Search friends"
							bg={useColorModeValue("white", "gray.800")}
							border="1px"
							borderColor={useColorModeValue(
								"gray.200",
								"gray.700"
							)}
							onChange={(e) => setSearchData(e.target.value)}
						/>
					</InputGroup>
				</FormControl>
				{pendingFriends?.length > 0 ? (
					<Box
						my={6}
						borderRadius={"xl"}
						p={4}
						bg={useColorModeValue("gray.200", "gray.800")}
					>
						<Text
							mb={4}
							fontSize={"xl"}
							fontWeight={"semibold"}
							ml={2}
						>
							New Requests!
						</Text>
						<Grid
							templateColumns={{
								base: "repeat(1, 1fr)",
								lg: "repeat(3, 1fr)",
							}}
							gap={{ base: 2, lg: 4 }}
						>
							{pendingFriends?.map((data, idx) => (
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
									bg={useColorModeValue(
										"white",
										"blackAlpha.300"
									)}
								>
									<Flex gap={2}>
										<Avatar
											name={data?.user?.full_name}
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
												{data?.user?.full_name}
											</Text>
											<Text
												fontSize={"smaller"}
												color="gray.500"
											>
												@{data?.user?.username}
											</Text>
										</Box>
									</Flex>
									<Flex gap={4}>
										<IconButton
											aria-label="Accept"
											icon={<HiOutlineCheck />}
											colorScheme="green"
											variant={"solid"}
											onClick={() =>
												acceptFriendMutation.mutate({
													id: data?.id,
													payload: {
														friend: data?.friend
															?.id,
														status: "A",
													},
												})
											}
										/>
										<IconButton
											aria-label="Reject"
											icon={<HiOutlineX />}
											colorScheme="gray"
											variant={"solid"}
											onClick={() =>
												removeFriendmutation.mutate({
													id: data?.id,
													payload: {
														friend: data?.user?.id,
														status: "R",
													},
												})
											}
										/>
									</Flex>
								</GridItem>
							))}
						</Grid>
					</Box>
				) : null}
				<Grid
					templateColumns={{
						base: "repeat(1, 1fr)",
						lg: "repeat(3, 1fr)",
					}}
					gap={{ base: 2, lg: 4 }}
				>
					{friendsData?.length > 0
						? friendsData?.map((data, idx) => (
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
											name={data?.friend?.full_name}
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
												{data?.friend?.full_name}
											</Text>
											<Text
												fontSize={"smaller"}
												color="gray.500"
											>
												@{data?.friend?.username}
											</Text>
										</Box>
									</Flex>
									{data?.friend?.status}
									<IconButton
										aria-label="user-minus"
										colorScheme="red"
										variant="solid"
										icon={<HiUserRemove />}
										onClick={() =>
											removeFriendmutation.mutate({
												id: data?.id,
												payload: {
													friend: data?.friend?.id,
													status: "R",
												},
											})
										}
									/>
								</GridItem>
						  ))
						: "No Friends found!"}
				</Grid>
			</Container>
		</Navbar>
	);
};
