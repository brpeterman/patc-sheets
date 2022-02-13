import React from "react";
import { UpgradeBox } from ".";
import { Ability, AbilityUpgrade, SkillType } from "../model/characters";
import { SectionHeader } from "./section-header";

export interface AbilitiesProps {
  readonly baseAbilities: Ability[];
  readonly availableUpgrades: { [key: string]: AbilityUpgrade };
  readonly purchasedUpgrades: string[];
  readonly heroPoints: number;
  readonly collapsed: boolean;
  readonly abilityUpgradeHandler: (u: string) => void;
  readonly toggleCollapseHandler: (s: string) => void;
}

export class Abilities extends React.Component<AbilitiesProps> {
  render() {
    return (
      <section className="abilities-container">
        <SectionHeader
          heading="Skills"
          id="abilities"
          collapsed={this.props.collapsed}
          toggleCollapseHandler={this.props.toggleCollapseHandler}
        />
        <div
          className={"collapsible" + (this.props.collapsed ? " hidden" : "")}
        >
          {this.props.baseAbilities.map((ability) => {
            const availableUpgrades = Object.keys(this.props.availableUpgrades)
              .map((abilityId) => {
                return {
                  id: abilityId,
                  upgrade: this.props.availableUpgrades[abilityId]!,
                };
              })
              .filter(
                (entry) => entry.upgrade.ablilityType === ability.abilityType
              );
            const upgradesModifier = availableUpgrades
              .filter((upgrade) =>
                this.props.purchasedUpgrades.includes(upgrade.id)
              )
              .reduce((sum, current) => sum + current.upgrade.modifier, 0);
            return (
              <div className="abilities-row" key={ability.abilityType}>
                <div className="abilities-list">
                  <div className="ability-primary-row">
                    <div className="ability-primary-title">
                      {ability.abilityType}
                    </div>
                    <div className="ability-primary-modifier">
                      +{upgradesModifier}
                    </div>
                  </div>
                  {ability.proficiencies ? (
                    <div className="ability-secondary-container">
                      {Object.keys(ability.proficiencies).map((proficiency) => {
                        return (
                          <div
                            className="ability-secondary-row"
                            key={proficiency}
                          >
                            <div className="ability-secondary-title">
                              {proficiency}
                            </div>
                            <div className="ability-secondary-modifier">
                              +
                              {ability.proficiencies[
                                proficiency as SkillType
                              ]! + upgradesModifier}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
                <div className="ability-primary-die">{ability.die}</div>
                <div className="ability-primary-upgrades">
                  {availableUpgrades.map((upgradeEntry) => {
                    const purchased = this.props.purchasedUpgrades.includes(
                      upgradeEntry.id
                    );
                    return (
                      <div className="ability-upgrade" key={upgradeEntry.id}>
                        <UpgradeBox
                          upgradeId={upgradeEntry.id}
                          heroPoints={this.props.heroPoints}
                          label={`+${upgradeEntry.upgrade.modifier}`}
                          onChange={(e) =>
                            this.props.abilityUpgradeHandler(upgradeEntry.id)
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
