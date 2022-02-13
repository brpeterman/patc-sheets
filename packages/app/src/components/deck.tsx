import React from "react";
import { UpgradeBox } from ".";
import { CardType, DeckUpgrade } from "../model/characters";
import { SectionHeader } from "./section-header";

export interface DeckProps {
  readonly baseDeck: { [key in CardType]: number };
  readonly favoredCards: string[];
  readonly availableUpgrades: { [key: string]: DeckUpgrade };
  readonly purchasedUpgrades: string[];
  readonly heroPoints: number;
  readonly collapsed: boolean;
  readonly deckUpgradeHandler: (u: string) => void;
  readonly toggleCollapseHandler: (s: string) => void;
}

export class Deck extends React.Component<DeckProps> {
  getCardTypeLimit(cardType: CardType): number {
    return Object.keys(this.props.availableUpgrades)
      .filter((upgradeId) => this.props.purchasedUpgrades.includes(upgradeId))
      .map((upgradeId) => this.props.availableUpgrades[upgradeId]!)
      .filter((deckUpgrade) => deckUpgrade.cardType === cardType)
      .reduce(
        (sum, current) => sum + current.modifier,
        this.props.baseDeck[cardType] || 0
      );
  }

  render() {
    const cardTypes = [
      CardType.Weapon,
      CardType.Spell,
      CardType.Armor,
      CardType.Item,
      CardType.Ally,
      CardType.Blessing,
    ];
    return (
      <section className="deck-container">
        <SectionHeader
          heading="Deck List"
          id="deck"
          collapsed={this.props.collapsed}
          toggleCollapseHandler={this.props.toggleCollapseHandler}
        />
        <div
          className={"collapsible" + (this.props.collapsed ? " hidden" : "")}
        >
          <div className="favored-cards">
            Favored cards: {this.props.favoredCards.join(", ")}
          </div>
          {cardTypes.map((cardType) => {
            const total = this.getCardTypeLimit(cardType);
            const availableUpgrades = Object.keys(this.props.availableUpgrades)
              .map((upgradeId) => {
                return {
                  id: upgradeId,
                  upgrade: this.props.availableUpgrades[upgradeId]!,
                };
              })
              .filter((entry) => entry.upgrade.cardType === cardType);
            return (
              <div className="deck-row" key={cardType}>
                <div className="deck-card-type">{cardType.toString()}</div>
                <div className="deck-card-type-limit">{total}</div>
                <div className="deck-upgrades">
                  {availableUpgrades.map((upgradeEntry) => {
                    const purchased = this.props.purchasedUpgrades.includes(
                      upgradeEntry.id
                    );
                    return (
                      <div className="deck-upgrade" key={upgradeEntry.id}>
                        <UpgradeBox
                          upgradeId={upgradeEntry.id}
                          heroPoints={this.props.heroPoints}
                          label={`+${upgradeEntry.upgrade.modifier}`}
                          onChange={(e) =>
                            this.props.deckUpgradeHandler(upgradeEntry.id)
                          }
                          purchased={purchased}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
}
