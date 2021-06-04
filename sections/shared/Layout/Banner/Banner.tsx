import { FC, useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Svg } from 'react-optimized-image';
import Color from 'color';

import { FlexDivCentered } from 'styles/common';
import CloseIcon from 'assets/svg/app/close.svg';

export enum BannerType {
	INFORMATION = 'information',
	ATTENTION = 'attention',
	WARNING = 'warning',
}

type BannerProps = {
	message: JSX.Element;
	localStorageKey?: string | undefined;
	type?: BannerType;
};

const Banner: FC<BannerProps> = ({ message, localStorageKey, type = BannerType.INFORMATION }) => {
	const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);

	const fetchFromLocalStorage = useCallback(() => {
		if (!localStorageKey) {
			setIsBannerVisible(true);
			return;
		}
		if (!localStorage.getItem(localStorageKey)) return;
		setIsBannerVisible(localStorage.getItem(localStorageKey) === 'true');
	}, [localStorageKey]);

	useEffect(() => {
		fetchFromLocalStorage();
	}, [fetchFromLocalStorage]);

	const handleHideBanner = () => {
		if (!localStorageKey) return;
		localStorage.setItem(localStorageKey, 'false');
		fetchFromLocalStorage();
	};

	if (!isBannerVisible) return null;
	return (
		<Container>
			<Inner>
				<Bar type={type} />
				<Message>{message}</Message>

				{type !== BannerType.WARNING && (
					<ButtonClose onClick={handleHideBanner}>
						<Svg src={CloseIcon} />
					</ButtonClose>
				)}
			</Inner>
		</Container>
	);
};

const Container = styled(FlexDivCentered)`
	width: 568px;
	height: 44px;
	background-color: ${(props) => props.theme.colors.mediumBlue};
	border-radius: 4px;
	position: absolute;
	left: 180px;
	top: 24px;
`;

const Inner = styled(FlexDivCentered)`
	height: 100%;
	position: relative;
`;

const BarInfo = css`
	border-color: ${(props) => props.theme.colors.blue};
`;
const BarAttention = css`
	border-color: ${(props) => props.theme.colors.yellow};
`;
const BarWarning = css`
	border-color: ${(props) => props.theme.colors.pink};
`;

const Bar = styled.div<{ type: string }>`
	height: 100%;
	border-width: 2px;
	border-style: solid;
	box-shadow: 0px 0px 15px ${(props) => Color(props.theme.colors.pink).alpha(0.6).rgb().string()};
	${(props) => props.type === BannerType.INFORMATION && BarInfo}
	${(props) => props.type === BannerType.ATTENTION && BarAttention}
	${(props) => props.type === BannerType.WARNING && BarWarning}
`;

const Message = styled.div`
	padding: 0 28px 0 16px;
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	font-size: 14px;
`;

const ButtonClose = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	right: 6px;
	background: none;
	border: none;
	padding: 0;
	height: 12px;
	outline: none;
	cursor: pointer;
`;

export default Banner;
