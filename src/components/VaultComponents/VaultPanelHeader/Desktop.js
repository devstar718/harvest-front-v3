import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ARBITRUM from '../../../assets/images/chains/arbitrum.svg'
import BASE from '../../../assets/images/chains/base.svg'
import ETHEREUM from '../../../assets/images/logos/badge/ethereum.svg'
import POLYGON from '../../../assets/images/logos/badge/polygon.svg'
import LSD from '../../../assets/images/logos/lsd.svg'
import DESCI from '../../../assets/images/logos/DeSci.svg'
import { directDetailUrl } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { BadgeIcon, LogoImg, PanelContainer, ValueContainer } from './style'
import VaultApy from './sub-components/VaultApy'
import VaultDailyApy from './sub-components/VaultDailyApy'
import VaultName from './sub-components/VaultName'
import VaultUserBalance from './sub-components/VaultUserBalance'
import VaultValue from './sub-components/VaultValue'

const chainList = [
  { id: 1, name: 'Ethereum', chainId: 1 },
  { id: 2, name: 'Polygon', chainId: 137 },
  { id: 3, name: 'Arbitrum', chainId: 42161 },
  { id: 4, name: 'Base', chainId: 8453 },
]

const DesktopPanelHeader = ({
  token,
  tokenSymbol,
  useIFARM,
  vaultPool,
  isSpecialVault,
  multipleAssets,
  loadedVault,
  loadingFarmingBalance,
  lsdToken,
  desciToken,
}) => {
  const BadgeAry = [ETHEREUM, POLYGON, ARBITRUM, BASE]

  const chainId = token.chain || token.data.chain
  const [badgeId, setBadgeId] = useState(-1)

  const { logoUrl } = token

  const { push } = useHistory()

  const { fontColor, borderColor, badgeIconBackColor, setPrevPage } = useThemeContext()

  const mouseDownHandler = event => {
    if (event.button === 1) {
      const network = chainList[badgeId].name.toLowerCase()
      const address = isSpecialVault
        ? token.data.collateralAddress
        : token.vaultAddress || token.tokenAddress
      setPrevPage(window.location.href)
      const url = `${directDetailUrl}${network}/${address}`
      window.open(url, '_blank')
    }
  }

  useEffect(() => {
    const getBadge = () => {
      chainList.forEach((el, i) => {
        if (el.chainId === Number(chainId)) {
          setBadgeId(i)
        }
      })
    }
    getBadge()
  }, [chainId])

  return (
    <>
      <PanelContainer
        fontColor={fontColor}
        borderColor={borderColor}
        onClick={e => {
          const network = chainList[badgeId].name.toLowerCase()
          const address = isSpecialVault
            ? token.data.collateralAddress
            : token.vaultAddress || token.tokenAddress
          setPrevPage(window.location.href)
          const url = `${directDetailUrl}${network}/${address}`
          if (e.ctrlKey) {
            window.open(url, '_blank')
          } else {
            push(url)
          }
        }}
        onMouseDown={mouseDownHandler}
      >
        <ValueContainer width="5%" />
        <ValueContainer width="20%" textAlign="left" paddingLeft="25px">
          {logoUrl.map((el, i) => (
            <LogoImg key={i} className="logo-img" zIndex={10 - i} src={el} alt={tokenSymbol} />
          ))}
          <BadgeIcon
            badgeBack={badgeIconBackColor}
            borderColor={token.inactive ? 'orange' : '#29ce84'}
          >
            {BadgeAry[badgeId] ? (
              <img src={BadgeAry[badgeId]} width="17px" height="17px" alt="" />
            ) : (
              <></>
            )}
          </BadgeIcon>
          {lsdToken ? <img className="tag" src={LSD} alt="" /> : null}
          {desciToken ? <img className="tag" src={DESCI} alt="" /> : null}
        </ValueContainer>
        <ValueContainer width="20%" textAlign="left" paddingLeft="0%">
          <VaultName token={token} tokenSymbol={tokenSymbol} useIFARM={useIFARM} />
        </ValueContainer>
        <ValueContainer width="15%">
          <VaultApy
            token={token}
            tokenSymbol={tokenSymbol}
            vaultPool={vaultPool}
            isSpecialVault={isSpecialVault}
          />
        </ValueContainer>
        <ValueContainer width="15%">
          <VaultDailyApy
            token={token}
            tokenSymbol={tokenSymbol}
            vaultPool={vaultPool}
            isSpecialVault={isSpecialVault}
          />
        </ValueContainer>
        <ValueContainer width="15%">
          <VaultValue token={token} />
        </ValueContainer>
        <ValueContainer width="10%">
          <VaultUserBalance
            token={token}
            tokenSymbol={tokenSymbol}
            multipleAssets={multipleAssets}
            isSpecialVault={isSpecialVault}
            loadingFarmingBalance={loadingFarmingBalance}
            vaultPool={vaultPool}
            loadedVault={loadedVault}
            useIFARM={useIFARM}
          />
        </ValueContainer>
      </PanelContainer>
    </>
  )
}

export default DesktopPanelHeader
