import {
	Stat,
	StatGroup,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

export const TopCards = () => {
	return (
		<StatGroup columnGap={5} mb={5}>
			{[0, 1, 0].map((key) => (
				<Stat
					border={"1px"}
					rounded={"lg"}
					borderColor={useColorModeValue("gray.300", "gray.700")}
					p={4}
					bgColor={useColorModeValue("white", "gray.800")}
				>
					<StatLabel>Sent</StatLabel>
					<StatNumber>345,670</StatNumber>
					<StatHelpText>
						<StatArrow type={key === 1 ? "increase" : "decrease"} />
						23.36%
					</StatHelpText>
				</Stat>
			))}
			{/* 
			<Stat border={"1px"} rounded={"lg"} borderColor={"gray.300"} p={4}>
				<StatLabel>Clicked</StatLabel>
				<StatNumber>45</StatNumber>
				<StatHelpText>
					<StatArrow type="decrease" />
					9.05%
				</StatHelpText>
			</Stat> */}
		</StatGroup>
	);
};
