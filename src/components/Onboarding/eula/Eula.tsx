import { Heading, VStack, Text, Divider, Checkbox, Button, Container } from "@chakra-ui/react";
import React from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

const LAST_UPDATED_DATE = "8 August 2023";

const Eula: React.FC<{
  goToStep: (step: Step) => void;
}> = ({ goToStep }) => {
  const [isChecked, setIsChecked] = React.useState(false);
  const eulaItems = [
    {
      title: "",
      content: `This document sets out the terms and conditions (the "Site Terms") that apply whenever you ("you") use https://umamiwallet.com, its sub-domains, any pages and/or functionalities, and any of the APIs and other component applications (the "Site”) to obtain the Umami Wallet (as defined below) and/or use other functions. If you do not understand or do not agree to these Terms, please do not use the Site. These Site Terms were most recently updated on ${LAST_UPDATED_DATE}.`,
    },
    {
      title: "Who we are",
      content: `We are TRILITECH KANVAS LIMITED, a business company incorporated with company number 2097653 under the laws of the British Virgin Islands with its registered address at Trinity Chambers, Ora et Labora Building, Wickhams Cay II (PO Box 4301), Road Town, Tortola, British Virgin as the operator of the Site ("we” or "us").`,
    },
    {
      title: "Contact us",
      content: `If you would like to contact us, you can do so by writing to us at umami-support@trili.tech`,
    },
    {
      title: "Privacy Policy",
      content: (
        <>
          Our Privacy Policy describes the ways we collect, use, store and disclose your personal
          information. Please see the Privacy Policy for more information
          <br />
          <a style={{ fontWeight: 600 }} href="https://umamiwallet.com/privacypolicy.html">
            Link to Privacy Policy
          </a>
        </>
      ),
    },
    {
      title: "Accepting the Site Terms",
      content: `Please read these Site Terms carefully before using the Site. We are only willing to make the Site available if you accept all the provisions of the Site Terms.
      \nYou confirm, if you are using the Site on your own behalf, that you are at least 18 years of age and in any event, at least of the legal age required in your country to enter the Site Terms, and if you are using the Site behalf of an organization or company, that you have the legal authority to bind any such organization or company to the Site Terms.
      \nBy using the Site or any part of it, or by indicating your acceptance by clicking the "I accept" button, you are confirming that you understand and agree on your own behalf or, where applicable, on behalf of the organisation or company you are acting for, to be bound by the Site Terms.
      \nThese Site Terms are only available in English and we do not store or file copies of any contracts.`,
    },
    {
      title: "Definitions and Interpretation",
      content: `In these Site Terms these words and phrases have the following meaning:
      \n"IP": means any intellectual property, including patents (including patent applications and disclosures), copyrights, trade secrets, trademarks, know-how or any other intellectual property rights recognized in any country or jurisdiction in the world.
      \n"Site Materials": collectively, the Site and all IP in it, including in all designs and other creative works, systems, methods, information, computer code, software, services, "look and feel”, organization, compilation of the content, code, data, and all other elements of the Site.
      \n"tez": the native token of Tezos.
      \n"Tezos": collectively, the Tezos Technologies and the Tezos Network. "Tezos” does not exist as a legal person, and no single entity owns, manages, or controls the Tezos Technology or the Tezos network.
      \n"Tezos Network": the peer-to-peer permissionless blockchain computer networks powered by Tezos Technologies.
      \n"Tezos Technologies": the open-source distributed ledger and blockchain software technologies known as the Tezos protocol.
      \n"Umami Wallet": means the open-source software application that, among other matters, manages your private key and public key for the Tezos Network and carry out certain transactions, including relating to tez or other matters.`,
    },
    {
      title: "Licence Grant",
      content: `The Umami Wallet is built upon open-source software and is distributed under an open-source licence. Your use of the Umami Wallet is subject to the terms and conditions of the MIT open-source licence.
      \nCopyright: 2023, TRILITECH LIMITED
      \nPermission is hereby granted, free of charge, to any person obtaining a copy of the Umami Wallet, to deal in the Umami Wallet without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Umami Wallet, and to permit persons to whom the Umami Wallet is furnished to do so, subject to the following conditions.
      \nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of Umami Wallet.
      \nTHE UMAMI WALLET IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE UMAMI WALLETTHE UMAMI WALLET OR THE USE OR OTHER DEALINGS IN THE UMAMI WALLET.`,
    },
    {
      title: "Account Password and Security",
      content: `When using the Umami Wallet, you will be responsible for keeping your own security credentials, including but not limited to private keys, passwords, and recovery phrases, which may be a word seed phrase, an account file, or other locally stored secret information. The Umami Wallet encrypts this information locally with a password that you choose, which we cannot access or store on our servers.
      \nWe do not collect or hold your private keys, and we cannot access the Umami Wallet, recover keys, passwords, or other information, reset passwords, and/or reverse transactions. You are solely responsible for your use of the Umami Wallet, including without limitation for storing, backing-up, and maintaining the confidentiality of your keys, passwords, and information, and for the security of any transactions you perform using the Site.
      \nYou expressly relieve and release us from any and all liability and/or loss arising from your use of the Umami Wallet including your loss of your security key.`,
    },
    {
      title: "External Sites",
      content: `The Site may include hyperlinks to other websites or resources (collectively, the “External Sites”), which are provided solely as a convenience to our users. We have no control over any External Sites. You acknowledge and agree that we are not responsible for the availability of any External Sites, and that we do not endorse any advertising, products, or other materials on or made available from or through any External Sites. Furthermore, you acknowledge and agree that we are not liable for any loss or damage which may be incurred because of the availability or unavailability of the External Sites, or as a result of any reliance placed by you upon the completeness, accuracy or existence of any advertising, products or other materials on, or made available from, any External Sites.`,
    },
    {
      title: "Disclaimers",
      content: `Warranty disclaimer. You expressly understand and agree that your use of the Umami Wallet is at your sole risk. The Umami Wallet and the Site are provided on an “as is” and “as available” basis, without warranties of any kind, either express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose or non-infringement. You acknowledge that Umami Wallet has no control over, and no duty to take any action regarding: which users gain access to or use the Umami Wallet; how you may interpret or use the Umami Wallet; or what actions you may take as a result of having been exposed to the Umami Wallet. We make no representations concerning any content contained in or accessed through the Umami Wallet, and we will not be responsible or liable for the accuracy, copyright compliance, legality or decency of material contained in or accessed through the Umami Wallet.
      \nLimited promises. You understand and agree that we not make any promises or statements to you that:
      \nyour access to or use of the Site will meet your requirements;
      \nyour access to or use of the Site will be uninterrupted, timely, secure or free from error;
      \nusage data provided through the Site will be accurate;
      \nthe Site or any content, services, or features made available on or through the Site are free of viruses or other harmful components; or
      \nthat any data that you disclose when you use the Site will be secure. Some jurisdictions do not allow the exclusion of implied warranties in contracts with consumers, so some or all of the above exclusions may not apply to you.
      \nInformation risk. You accept that the content on the Site is provided as general information only and is not special to you or the way or purpose for which you wish to use the Site and the available services. None of the information provided is intended to be technical, professional, or any other form of advice that considers your needs and circumstances and therefore, none of the information should be relied on as such. You must obtain professional or specialist advice before taking, or
      \nrefraining from, any action based on the content on the Site.
      \nInternet risk. You accept the inherent security risks of providing information and dealing online over the internet.
      \nUmami Wallet risk. We will not be responsible or liable to you for any losses you incur as the result of your use of Tezos or your Umami Wallet, including but not limited to any losses, damages or claims arising from:
      \nuser error, such as forgotten passwords or incorrectly construed smart contracts or other transactions;
      \nserver failure or data loss;
      \ncorrupted Umami Wallet files; or
      \nunauthorized access or activities by third parties, including, but not limited to, the use of viruses, phishing, brute-forcing or other means of attack against the Site, Tezos, or any Umami Wallet.
      \nBlockchain risks. We are not responsible for losses due to failures of the Tezos Network or the Tezos Technologies, or any Umami Wallet, or any other operational aspects of Tezos, including but not limited to late or no disclosure by developers or representatives (or no reporting at all) of any issues with Tezos.
      \nUse of Blockchain. The Site does not store, send, or receive tez. Any transfer of tez occurs within the Tezos Network, and not on the Site.
      \nRegulatory Uncertainty. The regulatory regime governing blockchain technologies, cryptocurrencies and tokens is uncertain, and new regulations or policies may materially adversely affect the development of the blockchain ecosystem. We are not responsible for the impact that any future regulations or laws may have on your usage of the Umami Wallet or the underlying blockchain network.
      \nApplication Security. You acknowledge that blockchain applications are code subject to flaws and acknowledge that you are solely responsible for evaluating any code provided by the Umami Wallet and the trustworthiness of any third-party websites, products, smart-contracts, or content you access or use through the Site. You further expressly acknowledge and represent that blockchain applications can be written maliciously or negligently, that Umami Wallet cannot be held liable for your interaction with such applications and that such applications may cause the loss of property or even identity. This warning and others later provided by Umami Wallet in no way evidence or represent an on-going duty to alert you to all of the potential risks of utilizing the Services or Content. The code to Umami Wallet can be found at: https://github.com/trilitech/umami-v2
      \nRisk of Weaknesses or Exploits in the Field of Cryptography. You acknowledge and understand that cryptography is a progressing field. Advances in code cracking or technical advances such as the development of quantum computers may present risks to cryptocurrencies and the Umami Wallet, which could result in the theft or loss of your cryptographic tokens or property. To the extent possible, Umami Wallet intends to update the protocol underlying Software to account for any advances in cryptography and to incorporate additional security measures, but does not guarantee or otherwise represent full security of the system. By using the Umami Wallet or accessing the Site, you acknowledge these inherent risks.`,
    },
    {
      title: "Linking to the Site",
      content: `Linking to the Site. You may establish links to the Site home page, provided you do so in a way that is fair and legal and does not damage our reputation or take advantage of it, and that the website in which you are linking complies in all respects with the provisions of this Clause 6. We reserve the right to withdraw linking permission without notice.
      \nRestrictions on Linking. You must not frame the Site on any other website, and you must not establish a link:
      \nTo any part of the Site other than the home page.
      \nIn such a way as to suggest any form of association, approval, or endorsement on our part where none exists.
      \nTo the Site in any website that is not owned by you.`,
    },
    {
      title: "Site Ownership and User Authorities",
      content: `Ownership of the Site and the Site Materials. You acknowledge and agree that we (or, as applicable, our licensors) own all IP and other legal right, title, and interest in and to all elements of the Site Materials. You acknowledge that the Site Materials are protected by copyright, trade dress, patent, and trademark laws, international conventions, other relevant intellectual property and proprietary rights, and applicable laws. All the Site Materials are the copyrighted property of us or our licensors, and all trademarks, service marks, and trade names associated with the Site or otherwise contained in the Site Materials are proprietary to us or our licensors.
      \nNo User Licence or Ownership of the Site Materials. Except as expressly out in this Section 8, your use of the Site does not grant you ownership of or any rights with respect to any content, code, data, or other components of the Site Materials. On our own behalf and on behalf of our licensors, we reserve all rights in and to the Site Materials that are not expressly granted to you in these Site Terms.
      \nHow you may use the Site Materials. The following conditions apply to the use of the Site Materials:
      \nYou may print off one copy, and may download extracts, of any page(s) from the Site for your personal use and you may draw the attention of others within your organisation to content posted on the Site.
      \nYou must not modify the paper or digital copies of any materials you have printed off or downloaded in any way, and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from any accompanying text.
      \nOur status (and that of any identified contributors) as the authors of content on the Site must always be acknowledged.
      \nIf you print off, copy, or download any part of the Site in breach of these terms, your right to use the Site will cease immediately and you must, at our option, return or destroy any copies of the materials you have made.
      \nYou will not apply for, register, or otherwise use or attempt to use any of our trademarks or service marks, or any confusingly similar marks, anywhere in the world without our prior written consent in each case, which consent we may withhold at our sole and absolute discretion.
      \nLimited Licence. Subject to your compliance with these terms, we grant you a revocable, non-exclusive, non-sublicensable and non-transferable licence to use the Site within the scope and purposes of the Site. You shall not access, use, or disclose our original source code, technique, algorithms, and procedures of or contained in or relating to the Site.`,
    },
    {
      title: "User Conduct and Prohibited Activities",
      content: `User Conduct. You agree that you are responsible for your own conduct while accessing or using the Site, and for any consequences. You agree to use the Site only for purposes that are legal, proper and in accordance with these the Site Terms and any applicable laws or regulations.
      \nProhibited Activities. You promise that your use of the Site will not and will not allow any third party to in any manner involve
      \nthe sending, uploading, distributing, or disseminating any unlawful, defamatory, harassing, abusive, fraudulent, obscene, or otherwise objectionable content;
      \nthe distribution of any viruses, worms, defects, Trojan horses, corrupted files, hoaxes, or any other items of a destructive or deceptive nature;
      \nthe uploading, posting, transmitting, or otherwise making available through the Site of any content that infringes the intellectual proprietary rights of any party;
      \nusing the Site to breach the legal rights (such as rights of privacy and publicity) of others;
      \nengaging in, promoting, or encouraging illegal activity (including, without limitation, money laundering);
      \ninterfering with other users' enjoyment of the Site;
      \nexploiting the Site for any unauthorized commercial purpose;
      \nmodifying, adapting, translating, or reverse engineering any portion of the Site;
      \nremoving any copyright, trademark, or other proprietary rights notices contained in or via the Site or any part of it;
      \nreformatting or framing any portion of the Site;
      \ndisplaying any content via the Site that contains any hate-related or violent content or contains any other material, products or services that violate or encourage conduct that would violate any criminal laws, any other applicable laws, or any third-party rights;
      \nusing any spider, site search/retrieval application, or other device to retrieve or index any portion of the Site or the content posted via the Site, or to collect information about its users for any unauthorized purpose;
      \naccessing or using the Site for the purpose of creating a product or service that is competitive with any of our products or services;
      \nabusing, harassing, or threatening another user of the Site or any of our authorized representatives, customer service personnel, chat board moderators, or volunteers (including, without limitation, filing support tickets with false information, sending excessive emails or support tickets, obstructing our employees from doing their jobs, refusing to follow the instructions of our employees, or publicly disparaging us by implying favouritism by our employees or otherwise);
      \nusing any abusive, defamatory, ethnically or racially offensive, harassing, harmful, hateful, obscene, offensive, sexually explicit, threatening or vulgar language when communicating with another user of the Site or any of our authorized representatives, customer service personnel, chat board moderators, or volunteers;
      \nthe access to and use of the Site by automated means or under false or fraudulent pretences;
      \nthe impersonation of another person (via the use of an email address or otherwise);
      \nusing, employing, operating, or creating a computer program to simulate the human behaviour of a user or prospective user (commonly known as “bots”);
      \nacquiring tez through inappropriate or illegal means (including, among other things, using a stolen credit card, or a payment mechanism that you do not have the right to use;
      \nthe purchasing, selling, or facilitating the purchase and sale of any the Site access or access rights or interests to other persons for cash or cryptocurrency consideration; or
      \nor result in the wrongful seizure or receipt of any tez;
      \n(each of the above a “Prohibited Activity”).
      \nEffect of Your Breaches. If you engage in any of the Prohibited Activities, we may, upon giving prior notice, but only where its reasonable that we do so, and without limiting any of our other legal rights or remedies immediately suspend or terminate your access or continued access to the Site and take such other actions as we reasonably deem justified to protect us, the Site, any of our licensors, or any of the other the Site users from the consequences of your breach or breaches, including reporting the Prohibited Activity to the competent national authorities.`,
    },
    {
      title: "Limitation of Liability",
      content: `You have certain legal rights under the law. Nothing in these the Site Terms is intended to affect these legal rights and we do not exclude our liability where we are not permitted to do so under the law. For more information about your legal rights, contact your local consumer protection organisation.
      \nTo the extent permitted by law, we exclude all conditions, warranties, representations, or other terms which may apply to the Site or any content on it, whether express or implied. We exclude our liability for all action we may take in response to breaches of these Site Terms.
      \nWe are responsible for losses you suffer caused by us breaking these the Site Terms unless the loss is: (i) unexpected, so it was not obvious that it would happen and nothing you said to us before we accepted your order meant we should have expected it (so, in the law, the loss was unforeseeable) (ii) caused by a Force Majeure Event; (iii) avoidable, and something you could have avoided by taking reasonable action; or (iv) a business loss that relates to your use of the Site for the purposes of your trade, business, craft or profession.
      \nWe shall not be liable to any user for any loss or damage, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, even if foreseeable, arising under or in connection with:
      \nUse of, or inability to use, the Site or the services; or
      \nuse of or reliance on any content displayed on the Site.
      \nWe shall not be liable for indirect loss or damage including:
      \nLoss of profits, sales, business, or revenue;
      \nBusiness interruption;
      \nLoss of anticipated savings;
      \nLoss of business opportunity, goodwill, or reputation; or
      \nAny indirect or consequential loss or damage.
      \nWe shall not be liable for any loss or damage caused by a virus, distributed denial-of-service attack, or other technologically harmful material that may infect your computer equipment, computer programs, data, or other proprietary material due to your use of the Site or to your downloading of any content on it, or on any website linked to it.`,
    },
    {
      title: "Force Majeure Events",
      content: `We will not be liable or responsible to the you, nor be deemed to have defaulted under or breached these the Site Terms, for any failure or delay in fulfilling or performing any of these the Site Terms, when and to the extent such failure or delay is caused by or results from the following force majeure events (“Force Majeure Event(s)”):
      \nActs of God;
      \nFlood, fire, earthquake, epidemics, pandemics, including the 2019 novel coronavirus pandemic (COVID-19), tsunami, explosion;
      \nWar, invasion, hostilities (whether war is declared or not), terrorist threats or acts, riot or other civil unrest;
      \nGovernment order, law, or action;
      \nEmbargoes or blockades in effect on or after the date of this agreement;
      \nStrikes, labour stoppages or slowdowns or other industrial disturbances;
      \nShortage of adequate or suitable Internet connectivity, telecommunication breakdown or shortage of adequate power or electricity; and
      \nOther similar events beyond our control.
      \nPerformance During Force Majeure Events. If we suffer a Force Majeure Event, we will use reasonable efforts to promptly notify you of the Force Majeure Event, stating the period the occurrence is expected to continue. We will use diligent efforts to end the failure or delay and ensure the effects of such Force Majeure Event are minimized. We will resume the performance of our obligations as soon as reasonably practicable after the removal of the cause. If our failure or delay remains uncured for a period of forty-five (45) consecutive days following written notice given by us under this Section 12, we may terminate these Site Terms upon fifteen (15) days' written notice.`,
    },
    {
      title: "Changes to the Site and the Site Terms",
      content: `Changes to the Site. We are constantly innovating the Site to help provide the best possible experience. You acknowledge and agree that the form and nature of the Site, the Site Materials, and any part of it, may change from time to time without prior notice to you, and that we may add new features and change any part of the Site at any time without notice. Please note that we are under no obligation to update any content on the Site which may be out of date at any given time.
      \nChanges to the Site Terms. We have the right to change these the Site Terms at any time for the following reasons: (i) to improve the Site Terms, to make the Site Terms clearer or easier to understand, or to have all our users on the same the Site Terms; (ii) to comply with legal or regulatory requirements, such as mandatory laws that apply to us and our agreement with you, or where we are subject to a court order or judgment; (iii) to provide you with additional information about the Site, (iv) where we make changes to the Site or any available service, including where we change the way we structure the Site or the available services or expand the scope adding additional features, functionality or content; (v) where we reorganise the way we run our business, including merging with another brand or service; or (vi) for security reasons, including where we introduce additional security checks or software to protect the Site, the Site Materials, or a Token. We provide the Site on an ongoing basis and we cannot foresee what may change in the future. This means we may make changes or additions to these Site Terms for reasons other than those set out above.
      \nReview. Every time you wish to use the Site, please check the Site Terms to ensure you understand the terms that apply at that time. If you do not refuse to accept any such changes before they take place, we will take that as your acceptance of the changes.`,
    },
    {
      title: "Law and Jurisdiction",
      content: `You and we agree that English law applies to these the Site Terms. If you live in an EU Member State, you also have the benefit of any protection afforded to you by the mandatory provisions of the law of your country of residence. You can bring legal proceedings under these the Site Terms in the English courts or the courts of the EU Member State in which you live.`,
    },
    {
      title: "General",
      content: `The agreement between us and you is personal to you and no third party is entitled to benefit under it. You agree that we can transfer our rights and obligations under these Site Terms to any other companies in the same group as us, or to any other company or firm or person provided that your rights under this agreement will not be adversely affected as a result of such transfer. You may not transfer your rights or obligations under these Site Terms to anyone else.
      \nIf any paragraph or section, or if any part of a paragraph or section, of these the Site Terms is held to be unlawful, invalid or unenforceable by a court or legal authority, that paragraph or section, or any part of that paragraph or section, shall be treated as removed. The validity and enforceability of the remaining parts of these Site Terms shall continue and will not be affected.
      \nTo the extent we fail to or decide not to exercise any right of claim against you to which we are entitled, this will not constitute a waiver of that right unless otherwise indicated to you in writing.`,
    },
  ];
  return (
    <ModalContentWrapper
      icon={SupportedIcons.document}
      title="Umami Wallet End User License Agreement"
      subtitle={LAST_UPDATED_DATE}
    >
      <VStack spacing="10px" w="100%" h="500px" pr="4px" overflowY="auto">
        {eulaItems.map(item => {
          return (
            <Container key={item.title}>
              <Heading size="md" w="100%">
                {item.title}
              </Heading>
              <Text whiteSpace="pre-wrap" pt="8px" pb="28px" size="sm">
                {item.content}
              </Text>
            </Container>
          );
        })}
        <Divider />
        <Checkbox onChange={e => setIsChecked(e.target.checked)} pt="24px" pb="24px">
          I confirm that I have read and agreed with the terms of the User Agreement
        </Checkbox>
        <Button
          w="100%"
          size="lg"
          minH="48px" // VStack breaks button height
          isDisabled={!isChecked}
          onClick={() => {
            goToStep({ type: StepType.connectOrCreate });
          }}
        >
          Continue
        </Button>
      </VStack>
    </ModalContentWrapper>
  );
};

export default Eula;
