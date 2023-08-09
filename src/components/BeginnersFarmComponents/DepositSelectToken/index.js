import React, { useState, useEffect } from 'react'
import { useWallet } from '../../../providers/Wallet'
import {
  SelectToken,
  SelectTokenWido,
  CloseBtn,
  FilterInput,
  NewLabel,
  Search,
  NotConnectedWallet,
  ImgBtn,
} from './style'
import SelectTokenList from '../SelectTokenList'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import SearchIcon from '../../../assets/images/logos/beginners/search.svg'
import InfoIcon from '../../../assets/images/logos/beginners/info-circle.svg'

const DepositSelectToken = ({
  selectToken,
  setSelectToken,
  clickTokenId,
  setClickedTokenId,
  setPickedToken,
  setBalance,
  supTokenList,
  setPartHeight,
}) => {
  const { connected } = useWallet()
  const [filterWord, setFilterWord] = useState('')
  const [showDesc, setShowDesc] = useState(true)

  const onFilter = async e => {
    setFilterWord(e.target.value)
  }

  useEffect(() => {
    if (selectToken) {
      setPartHeight(350) // Set fixed height for select token part
    }
  }, [selectToken, setPartHeight])

  return (
    <SelectToken show={selectToken}>
      <SelectTokenWido>
        <NewLabel position="relative">
          <Search src={SearchIcon} />
          <FilterInput
            value={filterWord}
            placeholder="Search for ticker or full name"
            onChange={onFilter}
          />
          <CloseBtn
            src={CloseIcon}
            alt=""
            onClick={() => {
              setSelectToken(false)
              setPartHeight(null)
            }}
          />
        </NewLabel>

        <NewLabel heightDiv="85%" divScroll="scroll" padding="15px 17px 0">
          {connected ? (
            <NewLabel weight="500" size="13px" height="19px" color="#475467">
              Tokens on your connected wallet that you can use as a deposit:
            </NewLabel>
          ) : (
            <></>
          )}
          {connected ? (
            <SelectTokenList
              list={supTokenList}
              clickId={clickTokenId}
              setClickedId={setClickedTokenId}
              setPickedToken={setPickedToken}
              setBalance={setBalance}
              setSelectTokenWido={setSelectToken}
              setPartHeight={setPartHeight}
              filterWord={filterWord}
            />
          ) : (
            <NotConnectedWallet isShow={showDesc ? 'true' : 'false'}>
              <NewLabel marginRight="12px">
                <img src={InfoIcon} alt="" />
              </NewLabel>
              <NewLabel marginRight="12px">
                <NewLabel color="#344054" size="14px" height="20px" weight="600" marginBottom="4px">
                  Wallet not connected.
                </NewLabel>
                <NewLabel color="#475467" size="14px" height="20px" weight="400">
                  Please connect wallet to see the list of available tokens to deposit.
                </NewLabel>
              </NewLabel>
              <div>
                <ImgBtn
                  src={CloseIcon}
                  alt=""
                  onClick={() => {
                    setShowDesc(false)
                  }}
                />
              </div>
            </NotConnectedWallet>
          )}
        </NewLabel>
      </SelectTokenWido>
    </SelectToken>
  )
}
export default DepositSelectToken
