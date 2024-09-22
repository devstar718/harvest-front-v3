import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { PiQuestion } from 'react-icons/pi'
import ReactTooltip from 'react-tooltip'
import { Dropdown } from 'react-bootstrap'
import { IoCheckmark } from 'react-icons/io5'
import { useThemeContext } from '../../providers/useThemeContext'
import sortDescIcon from '../../assets/images/ui/desc.svg'
import sortAscIcon from '../../assets/images/ui/asc.svg'
import sortIcon from '../../assets/images/ui/sort.svg'
import { fetchLeaderboardData } from '../../utilities/apiCalls'
import {
  Column,
  Container,
  Header,
  Inner,
  TransactionDetails,
  Col,
  TableContent,
  TableTitle,
  TableIntro,
  SpaceLine,
  NewLabel,
  BetaBadge,
  HeaderButton,
  CurrencyDropDown,
  CurrencySelect,
  CurrencyDropDownMenu,
  CurrencyDropDownItem,
} from './style'
import HolderRow from '../../components/LeaderboardComponents/HolderRow'
import { useVaults } from '../../providers/Vault'
import { FARM_TOKEN_SYMBOL, SPECIAL_VAULTS } from '../../constants'
import { useStats } from '../../providers/Stats'
import { usePools } from '../../providers/Pools'
import { addresses } from '../../data'
import ChevronDown from '../../assets/images/ui/chevron-down.svg'
import Pagination from '../../components/LeaderboardComponents/Pagination'

const LeaderBoard = () => {
  const { vaultsData } = useVaults()
  const { profitShareAPY } = useStats()
  const { totalPools } = usePools()
  const {
    bgColor,
    backColor,
    fontColor,
    borderColor,
    darkMode,
    backColorButton,
    hoverColorNew,
    fontColor1,
    fontColor2,
    hoverColor,
    inputBorderColor,
    bgColorFarm,
  } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const [sortConfig, setSortConfig] = useState({ key: 'totalBalance', direction: 'descending' })
  const [leadersApiData, setLeadersApiData] = useState(null)
  const [selectedItem, setSelectedItem] = useState('Top Allocation')
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 100

  let correctedApiData = {}

  const handleItemClick = useCallback(item => {
    setSelectedItem(item)
  }, [])

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchLeaderboardData()
        setLeadersApiData(data)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
      }
    }

    getData()
  }, [])

  const farmProfitSharingPool = totalPools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
        tokenAddress: addresses.iFARM,
        rewardSymbol: 'iFarm',
        tokenNames: ['FARM'],
        platform: ['Harvest'],
        decimals: 18,
      },
    }),
    [farmProfitSharingPool, profitShareAPY],
  )

  const groupOfVaults = { ...vaultsData, ...poolVaults }

  const getTokenNames = (userVault, dataVaults) => {
    const vaults = userVault.vaults
    const tokenNames = []
    const matchedVaults = {}

    Object.entries(vaults).forEach(([vaultKey, vaultValue]) => {
      if (vaultValue.dailyYield === 0 || vaultValue.dailyReward + vaultValue.dailyReward === 0) {
        return
      }

      const match = Object.entries(dataVaults).find(([, vaultData]) => {
        return (
          vaultData.vaultAddress &&
          vaultData.vaultAddress.toLowerCase() === vaultKey.toLowerCase() &&
          !vaultData.inactive
        )
      })

      if (match) {
        const [, vaultData] = match
        if (vaultData.tokenNames.length > 1) {
          tokenNames.push(vaultData.tokenNames.join(', '))
        } else {
          tokenNames.push(...vaultData.tokenNames)
        }
        matchedVaults[vaultKey] = vaults[vaultKey]
      }
    })

    userVault.vaults = matchedVaults
    return tokenNames
  }

  const rearrangeApiData = apiData => {
    const vaultsFilteredData = Object.entries(apiData)
      .map(([wallet, entry]) => {
        const vaultTokenNames = getTokenNames(entry, groupOfVaults)
        if (vaultTokenNames.length > 0) {
          return [wallet, entry]
        }
        return null
      })
      .filter(item => item != null)

    const filteredApiData = Object.fromEntries(vaultsFilteredData)

    const vaultBalanceSortedData = Object.entries(filteredApiData)
      .map(([address, data]) => {
        const totalVaultBalance = Object.values(data.vaults).reduce((sum, vault) => {
          return sum + vault.balance
        }, 0)

        return { address, data, totalVaultBalance }
      })
      .sort((a, b) => b.totalVaultBalance - a.totalVaultBalance)
      .reduce((acc, { address, data }) => {
        acc[address] = data
        return acc
      }, {})

    Object.entries(vaultBalanceSortedData).forEach(([, value]) => {
      if (value.vaults) {
        value.vaults = Object.fromEntries(
          Object.entries(value.vaults).sort(([, a], [, b]) => b.balance - a.balance),
        )
      }
    })

    // const allWalletInfo = Object.entries(vaultBalanceSortedData).slice(0, 150)

    // const top100Data = allWalletInfo.slice(0, 100)

    // const sortedApiData = Object.fromEntries(top100Data)

    // console.log('sortedApiData', sortedApiData)

    return vaultBalanceSortedData
  }

  if (leadersApiData) {
    correctedApiData = rearrangeApiData(leadersApiData)
  }

  const handleSort = useCallback(
    key => {
      let direction = 'descending'
      if (sortConfig.key === key && sortConfig.direction === 'descending') {
        direction = 'ascending'
      }
      setSortConfig({ key, direction })
    },
    [sortConfig],
  )

  const SortingIcon = ({ sortType, sortField, selectedField }) => {
    return (
      <>
        {sortType === 'ascending' && sortField === selectedField && (
          <img
            className="sort-icon"
            src={sortAscIcon}
            alt="Sort ASC"
            style={{ marginLeft: '5px' }}
          />
        )}
        {sortType === 'descending' && sortField === selectedField && (
          <img
            className="sort-icon"
            src={sortDescIcon}
            alt="Sort DESC"
            style={{ marginLeft: '5px' }}
          />
        )}
        {sortType !== selectedField && sortField !== selectedField && (
          <img className="sort-icon" src={sortIcon} alt="Sort" style={{ marginLeft: '5px' }} />
        )}
      </>
    )
  }

  const sortedData = useMemo(() => {
    const sortableItems = Object.entries(correctedApiData)
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let valueA = 0,
          valueB = 0

        if (sortConfig.key === 'totalBalance') {
          const vaultAArray = Object.entries(a[1].vaults)
          const vaultBArray = Object.entries(b[1].vaults)
          for (let i = 0; i < vaultAArray.length; i += 1) {
            valueA += vaultAArray[i][1].balance
          }
          for (let i = 0; i < vaultBArray.length; i += 1) {
            valueB += vaultBArray[i][1].balance
          }
        } else if (sortConfig.key === 'Efficiency') {
          const monthlyYieldA = (a[1].totalDailyYield * 365) / 12
          const monthlyYieldB = (b[1].totalDailyYield * 365) / 12
          valueA = (monthlyYieldA / a[1].totalBalance) * 12 * 100 || 0
          valueB = (monthlyYieldB / b[1].totalBalance) * 12 * 100 || 0
        } else if (sortConfig.key === 'MonthlyYield') {
          valueA = (a[1].totalDailyYield * 365) / 12
          valueB = (b[1].totalDailyYield * 365) / 12
        } else if (sortConfig.key === 'balance') {
          valueA = Math.max(...Object.values(a[1].vaults).map(vault => vault.balance))
          valueB = Math.max(...Object.values(b[1].vaults).map(vault => vault.balance))
        } else {
          valueA = Object.values(a[1].vaults).reduce(
            (acc, vault) => acc + (vault[sortConfig.key] || 0),
            0,
          )
          valueB = Object.values(b[1].vaults).reduce(
            (acc, vault) => acc + (vault[sortConfig.key] || 0),
            0,
          )
        }
        if (valueA < valueB) return sortConfig.direction === 'ascending' ? -1 : 1
        if (valueA > valueB) return sortConfig.direction === 'ascending' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [correctedApiData, sortConfig])

  const { currentItems, pageCount } = useMemo(() => {
    const endOffset = itemOffset + itemsPerPage
    const currentItems1 = Object.entries(sortedData).slice(itemOffset, endOffset)
    const pageCount1 = Math.ceil(Object.entries(sortedData).length / itemsPerPage)
    return { currentItems: currentItems1, pageCount: pageCount1 }
  }, [sortedData, itemOffset, itemsPerPage])

  const handlePageClick = useCallback(
    event => {
      const newOffset = (event.selected * itemsPerPage) % Object.entries(sortedData).length
      setItemOffset(newOffset)
    },
    [sortedData, itemsPerPage],
  )

  return isMobile ? (
    <Container>
      <Inner style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <TableTitle>
            Leaderboard <BetaBadge>Beta</BetaBadge>
          </TableTitle>
          <TableIntro marginBottom="0px">Displaying data from all networks. </TableIntro>
        </div>
        <HeaderButton style={{ width: '42%' }}>
          <Dropdown>
            <CurrencyDropDown
              id="dropdown-basic"
              bgcolor={backColorButton}
              fontcolor2={fontColor2}
              hovercolor={hoverColorNew}
              style={{ padding: 0 }}
            >
              <CurrencySelect backColor={backColor} fontcolor2={fontColor2} hovercolor={hoverColor}>
                <div>{selectedItem}</div>
                <img src={ChevronDown} alt="Chevron Down" />
              </CurrencySelect>
            </CurrencyDropDown>
            <CurrencyDropDownMenu>
              <CurrencyDropDownItem
                onClick={() => {
                  handleItemClick('Top Allocation')
                  handleSort('balance')
                }}
              >
                <div>Top Allocation</div>
                {selectedItem === 'Top Allocation' && <IoCheckmark className="check-icon" />}
              </CurrencyDropDownItem>
              <CurrencyDropDownItem
                onClick={() => {
                  handleItemClick('Efficiency')
                  handleSort('Efficiency')
                }}
              >
                <div>Efficiency</div>
                {selectedItem === 'Efficiency' && <IoCheckmark className="check-icon" />}
              </CurrencyDropDownItem>
              <CurrencyDropDownItem
                onClick={() => {
                  handleItemClick('Monthly Yield')
                  handleSort('MonthlyYield')
                }}
              >
                <div>Monthly Yield</div>
                {selectedItem === 'Monthly Yield' && <IoCheckmark className="check-icon" />}
              </CurrencyDropDownItem>
            </CurrencyDropDownMenu>
          </Dropdown>
        </HeaderButton>
      </Inner>
      <Inner style={{ padding: '0px', borderRadius: '0px' }}>
        <TableContent borderColor={borderColor} count={100}>
          <Header borderColor={borderColor} backColor="#ffffff" borderRadius="0px" padding="0px">
            <Column width="50%" color={fontColor} fontSize="14px" padding="14px 28px">
              <Col># User</Col>
            </Column>
            <Column
              width="50%"
              color={fontColor}
              fontSize="14px"
              padding="14px 28px"
              onClick={() => {
                if (selectedItem === 'Top Allocation') {
                  handleSort('balance')
                } else if (selectedItem === 'Efficiency') {
                  handleSort('Efficiency')
                } else if (selectedItem === 'Monthly Yield') {
                  handleSort('MonthlyYield')
                }
              }}
            >
              <Col>{selectedItem}</Col>
            </Column>
          </Header>
          {sortedData &&
            sortedData.map(([key, value], index) => {
              const lastItem = index === sortedData.lendth - 1
              return (
                <HolderRow
                  key={key}
                  value={value}
                  cKey={index + 1}
                  accounts={key}
                  groupOfVaults={groupOfVaults}
                  lastItem={lastItem}
                  getTokenNames={getTokenNames}
                  selectedItem={selectedItem}
                />
              )
            })}
        </TableContent>
      </Inner>
    </Container>
  ) : (
    <Container bgColor={bgColor} fontColor={fontColor}>
      <Inner>
        <TableTitle>
          Leaderboard <BetaBadge>Beta</BetaBadge>
        </TableTitle>
        <TableIntro>Displaying data from all networks. </TableIntro>
        <SpaceLine />
        <TransactionDetails>
          <TableContent borderColor={borderColor} count={100}>
            <Header borderColor={borderColor} backColor="#f9fafb">
              <Column width={isMobile ? '5%' : '10%'} color={fontColor}>
                <Col>#</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col>Wallet</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('totalBalance')} cursor="pointer">
                  Balance
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="totalBalance"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col># of Farms</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('balance')} cursor="pointer">
                  Top Allocation
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="balance"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('Efficiency')} cursor="pointer">
                  Efficiency
                  <PiQuestion className="question" data-tip />
                  <ReactTooltip
                    backgroundColor={darkMode ? 'white' : '#101828'}
                    borderColor={darkMode ? 'white' : 'black'}
                    textColor={darkMode ? 'black' : 'white'}
                    place="top"
                  >
                    <NewLabel
                      size={isMobile ? '10px' : '12px'}
                      height={isMobile ? '15px' : '18px'}
                      weight="600"
                      width="296px"
                    >
                      <div>
                        <p>This metric shows how effectively a wallet generates yield:</p>
                        <ul style={{ paddingLeft: '20px' }}>
                          <li>
                            <strong>APY:</strong> The estimated yearly growth based on wallet&apos;s
                            balance on Harvest.
                          </li>
                          <li>
                            <strong>$ per $1 Allocated:</strong> Yearly yield for every $1 allocated
                            in Harvest.
                          </li>
                        </ul>
                      </div>
                    </NewLabel>
                  </ReactTooltip>
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="Efficiency"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('MonthlyYield')} cursor="pointer">
                  Monthly Yield
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="MonthlyYield"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '5%'} color={fontColor} justifyContent="center">
                <Col cursor="pointer" />
              </Column>
            </Header>
            {currentItems &&
              currentItems.map(([key, [accounts, value]], index) => {
                const lastItem = index === currentItems.length - 1
                return (
                  <HolderRow
                    key={key}
                    value={value}
                    cKey={Number(key) + 1}
                    accounts={accounts}
                    groupOfVaults={groupOfVaults}
                    lastItem={lastItem}
                    getTokenNames={getTokenNames}
                  />
                )
              })}
          </TableContent>
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            isMobile={isMobile}
            bgColor={bgColorFarm}
            fontColor={fontColor}
            fontColor1={fontColor1}
            fontColor2={fontColor2}
            inputBorderColor={inputBorderColor}
          />
        </TransactionDetails>
      </Inner>
    </Container>
  )
}

export default LeaderBoard
