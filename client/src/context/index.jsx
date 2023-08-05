// this is the file where all the web3 logic of this project is stored
// this context will be wrapped with all the pages
import React, {useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ( { children } ) => {
    const { contract } = useContract('0x503315bD39651cfc9DF2623A6C680e6809B79C71');

    const { mutateAsync : createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
          const data = await createCampaign({
                    args: [
                        address, // owner
                        form.title, // title
                        form.description, // description
                        form.target,
                        new Date(form.deadline).getTime(), // deadline,
                        form.image,
                    ],
                });
    
          console.log("contract call success", data)
        } catch (error) {
          console.log("contract call failure", error)
        }
      }
    
    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');
        
        const parsedCampaigns = campaigns.map((campaign, i) => ({

            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: 1
        }))

        console.log(parsedCampaigns);
    }  
      return(
        <StateContext.Provider 
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

// creating a custom hook
export const useStateContext = () => useContext(StateContext);