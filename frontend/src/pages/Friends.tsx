import React from "react";
import {
	Avatar,
	Box,
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
import { FiSearch, FiUserMinus } from "react-icons/fi";
import { Fa500Px, FaRegCompass } from "react-icons/fa";
import { Navbar } from "../components";
import { useQuery, useQueryClient } from "react-query";
import { axiosRequest } from "../utils";
import { useDebounce } from "../hooks";

export const Friends = () => {
	const [searchData, setSearchData] = React.useState<any>("");
	const [discoverToggle, setDiscoverToggle] = React.useState<boolean>(false);
	const [activeData, setActiveData] = React.useState<any>([]);
	const queryClient = useQueryClient();
	const debouncedSearchTerm = useDebounce(searchData, 500);

	const friends = useQuery({
		queryKey: ["friends", debouncedSearchTerm],
		queryFn: () =>
			axiosRequest
				.get(`/friends?friend=${debouncedSearchTerm}`)
				.then((res) => res.data),
		enabled: !discoverToggle,
		refetchOnWindowFocus: false,
	});

	const users = useQuery({
		queryKey: ["users", debouncedSearchTerm],
		queryFn: () =>
			axiosRequest
				.get(`/users?username=${debouncedSearchTerm}`)
				.then((res) => res.data),
		enabled: discoverToggle,
		refetchOnWindowFocus: false,
	});

	if (users.isFetching || friends.isFetching) {
		queryClient.invalidateQueries("friends");
		queryClient.invalidateQueries("users");
	}

	React.useEffect(() => {
		if (discoverToggle) {
			setActiveData(users!.data);
		} else {
			setActiveData(friends!.data);
		}
	}, [discoverToggle, users.isLoading, friends.isLoading]);

	const handleDiscoverToggle = () => {
		setDiscoverToggle(!discoverToggle);
	};

	return (
		<Navbar>
			<Container
				maxW={{ base: "container.lg", xl: "container.xl" }}
				px={{ base: 2, md: 4, lg: 4 }}
			>
				<FormControl
					w={{ base: "full", lg: "50%" }}
					justifyItems="center"
					m="auto"
					mb={{ base: "4", lg: "6" }}
					display="flex"
					gap={2}
				>
					<InputGroup>
						<InputLeftElement
							pointerEvents={"none"}
							children={<FiSearch />}
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
					<IconButton
						aria-label="discover"
						icon={discoverToggle ? <Fa500Px /> : <FaRegCompass />}
						variant={"outline"}
						bg={useColorModeValue("white", "gray.800")}
						onClick={handleDiscoverToggle}
					/>
				</FormControl>
				<Grid
					templateColumns={{
						base: "repeat(1, 1fr)",
						lg: "repeat(3, 1fr)",
					}}
					gap={{ base: 2, lg: 4 }}
				>
					{activeData?.length > 0
						? activeData?.map((val, idx) => (
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
											name={val.full_name}
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
												{val.full_name}
											</Text>
											<Text
												fontSize={"smaller"}
												color="gray.500"
											>
												@{val.username}
											</Text>
										</Box>
									</Flex>
									<IconButton
										aria-label="user-minus"
										colorScheme="red"
										variant="ghost"
										icon={<FiUserMinus />}
									/>
								</GridItem>
						  ))
						: "No data found!"}
				</Grid>
			</Container>
		</Navbar>
	);
};
