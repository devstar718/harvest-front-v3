import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import ListItem from '../ListItem'
import { useRate } from '../../../providers/Rate'
import { useThemeContext } from '../../../providers/useThemeContext'
import { formatAge, formatDateTime, formatNumber } from '../../../utilities/formats'
import { Content, DetailView, FlexDiv, NewLabel, MobileGreenBox, BadgePart } from './style'
import ARBITRUM from '../../../assets/images/logos/badge/arbitrum.svg'
import POLYGON from '../../../assets/images/logos/badge/polygon.svg'
import ZKSYNC from '../../../assets/images/logos/badge/zksync.svg'
import BASE from '../../../assets/images/logos/badge/base.svg'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import UpperIcon from '../../../assets/images/logos/history-upper.svg'

const ActionRow = ({ info }) => {
  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [badgeUrl, setBadgeUrl] = useState(ETHEREUM)
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const {
    darkMode,
    switchMode,
    backColor,
    borderColorTable,
    hoverColorRow,
    fontColor,
  } = useThemeContext()

  useEffect(() => {
    const chainId = info.chain
    const badge =
      Number(chainId) === 42161
        ? ARBITRUM
        : Number(chainId) === 8453
        ? BASE
        : Number(chainId) === 324
        ? ZKSYNC
        : Number(chainId) === 137
        ? POLYGON
        : ETHEREUM
    setBadgeUrl(badge)
  }, [info])

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  return (
    <DetailView
      className="latest-yield-row"
      borderColor={borderColorTable}
      hoverColor={hoverColorRow}
      mode={switchMode}
      style={{
        background: isMobile ? (darkMode ? '#171B25' : '#ffffff') : backColor,
      }}
    >
      <FlexDiv padding={isMobile ? '15px 25px' : '0'}>
        {!isMobile && (
          <>
            <Content width="30%" color={fontColor} paddingRight={isMobile ? '8px' : '0px'}>
              <div
                className="timestamp"
                data-tip
                data-for={`tooltip-latest-yield-${info.timestamp}`}
              >
                {formatAge(info.timestamp)} ago
              </div>
              <ReactTooltip
                id={`tooltip-latest-yield-${info.timestamp}`}
                backgroundColor={darkMode ? 'white' : '#101828'}
                borderColor={darkMode ? 'white' : 'black'}
                textColor={darkMode ? 'black' : 'white'}
                place="top"
              >
                <NewLabel size="10px" height="14px" weight="600">
                  <div dangerouslySetInnerHTML={formatDateTime(info.timestamp)} />
                </NewLabel>
              </ReactTooltip>
            </Content>
            <Content width="57%">
              <ListItem
                weight={600}
                size={12}
                height={20}
                color="#5FCF76"
                justifyContent="end"
                value={`${
                  info.netChangeUsd < 0.01
                    ? `<${currencySym}0.01`
                    : `≈${currencySym}${formatNumber(info.netChangeUsd * Number(currencyRate), 2)}`
                }`}
              />
              <ListItem
                weight={500}
                size={10}
                height={20}
                color="#6988FF"
                justifyContent="end"
                value={info.tokenSymbol}
              />
            </Content>
          </>
        )}
        {isMobile && (
          <>
            <Content
              width="30%"
              color={darkMode ? '#e8e8e8' : '#202020'}
              paddingRight={isMobile ? '8px' : '0px'}
            >
              <div
                className="timestamp"
                data-tip
                data-for={`tooltip-latest-yield-${info.timestamp}`}
              >
                {formatAge(info.timestamp)} ago
              </div>
              <ReactTooltip
                id={`tooltip-latest-yield-${info.timestamp}`}
                backgroundColor={darkMode ? 'white' : '#101828'}
                borderColor={darkMode ? 'white' : 'black'}
                textColor={darkMode ? 'black' : 'white'}
                place="top"
              >
                <NewLabel size="10px" height="14px" weight="600">
                  <div dangerouslySetInnerHTML={formatDateTime(info.timestamp)} />
                </NewLabel>
              </ReactTooltip>
            </Content>
            <Content display="flex" flexDirection="column" alignItems="end">
              <MobileGreenBox>
                <img src={UpperIcon} alt="upper icon" />
                <ListItem
                  weight={600}
                  size={12}
                  height={13.38}
                  color="#fff"
                  justifyContent="end"
                  value={`${
                    info.netChangeUsd < 0.01
                      ? `<${currencySym}0.01`
                      : `≈${currencySym}${formatNumber(
                          info.netChangeUsd * Number(currencyRate),
                          2,
                        )}`
                  }`}
                />
              </MobileGreenBox>
              <BadgePart>
                <img src={badgeUrl} alt="badge" width={9.7} height={9.7} />
                <ListItem
                  weight={400}
                  size={10}
                  height={20}
                  color={darkMode ? '#D9D9D9' : '#6F78AA'}
                  justifyContent="end"
                  value={`${info.name} (${info.platform})`}
                />
              </BadgePart>
            </Content>
          </>
        )}
      </FlexDiv>
    </DetailView>
  )
}
export default ActionRow
