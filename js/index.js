const { createApp } = Vue;

createApp({
  data() {
    return {
      champions: [],
      actualTeamA: [],
      actualTeamB: [],
      teamA: [],
      teamB: [],
      items: [],
      boots: [],
      spells: [],
      participants: [],
    };
  },

  methods: {
    addParticipant(event) {
      const name = event.target.value;

      this.$refs.participants.value = "";

      if (name === null || name.match(/^ *$/) !== null) {
        return;
      } else {
        this.participants.push(name);
      }

      localStorage.setItem("participants", JSON.stringify(this.participants));
    },

    removeParticipant(index) {
      this.participants.splice(index, 1);

      localStorage.setItem("participants", JSON.stringify(this.participants));
    },

    drawNumber(end) {
      return Math.floor(Math.random() * end);
    },

    drawTeams() {
      const toUse = this.participants
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      const numbers = [];

      while (numbers.length !== this.participants.length) {
        let drawed = this.drawNumber(this.participants.length);

        !numbers.includes(drawed)
          ? numbers.push(drawed)
          : (drawed = Math.floor(Math.random() * this.participants.length));
      }

      let namesA = [];
      let namesB = [];

      if (this.participants.length % 2 === 0) {
        namesA = toUse.slice(0, this.participants.length / 2);

        namesB = toUse.slice(
          this.participants.length / 2,
          this.participants.length
        );
      } else if (this.drawNumber(2) === 0) {
        namesA = toUse.slice(0, Math.ceil(this.participants.length / 2));

        namesB = toUse.slice(
          Math.floor(this.participants.length / 2) + 1,
          this.participants.length
        );
      } else {
        namesA = toUse.slice(0, Math.floor(this.participants.length / 2));

        namesB = toUse.slice(
          Math.floor(this.participants.length / 2),
          this.participants.length
        );
      }

      namesA.map((name) =>
        this.teamA.push({
          participant: name,
        })
      );

      namesB.map((name) =>
        this.teamB.push({
          participant: name,
        })
      );

      this.drawComps();
    },

    drawComps() {
      if (this.teamA.length < 1 || this.teamB.length < 1) return;

      const draft = [];

      while (draft.length !== this.participants.length) {
        let drawed = this.drawNumber(this.champions.length);

        if (
          draft.find(
            (element) => element.champion === this.champions[drawed]
          ) == null
        ) {
          const toPush = this.champions[drawed];

          const singleChampItems = [];
          const singleChampSpells = [];

          while (
            singleChampItems.length !== (toPush.name === "Cassiopeia" ? 5 : 4)
          ) {
            let drawed = this.drawNumber(this.items.length);

            if (
              toPush.melee &&
              this.items[drawed].name === "Furacão de Runaan"
            ) {
              drawed = this.drawNumber(this.items.length);
            } else if (singleChampItems.includes(this.items[drawed])) {
              drawed = this.drawNumber(this.items.length);
            } else if (this.items[drawed].mythic) {
              drawed = this.drawNumber(this.items.length);
            } else if (
              this.items[drawed].anti_heal &&
              singleChampItems.some((item) => item.anti_heal)
            ) {
              drawed = this.drawNumber(this.items.length);
            } else if (
              this.items[drawed].armor_pen &&
              singleChampItems.some((item) => item.armor_pen)
            ) {
              drawed = this.drawNumber(this.items.length);
            } else if (
              this.items[drawed].shield &&
              singleChampItems.some((item) => item.shield)
            ) {
              drawed = this.drawNumber(this.items.length);
            } else if (
              this.items[drawed].mana &&
              singleChampItems.some((item) => item.mana)
            ) {
              drawed = this.drawNumber(this.items.length);
            } else if (
              this.items[drawed].hidra &&
              singleChampItems.some((item) => item.hidra)
            ) {
              drawed = this.drawNumber(this.items.length);
            } else {
              singleChampItems.push(this.items[drawed]);
            }
          }

          while (true) {
            let drawed = this.drawNumber(this.items.length);

            if (this.items[drawed].mythic) {
              singleChampItems.push(this.items[drawed]);
              break;
            } else {
              drawed = this.drawNumber(this.items.length);
            }
          }

          if (toPush.name !== "Cassiopeia") {
            let drawed = this.drawNumber(this.boots.length);
            singleChampItems.push(this.boots[drawed]);
          }

          toPush.items = singleChampItems;

          while (singleChampSpells.length !== 2) {
            let drawed = this.drawNumber(this.spells.length);

            if (singleChampSpells.includes(this.spells[drawed])) {
              drawed = this.drawNumber(this.spells.length);
            } else {
              singleChampSpells.push(this.spells[drawed]);
            }
          }

          toPush.spells = singleChampSpells;

          draft.push(toPush);
        } else {
          drawed = this.drawNumber(this.champions.length);
        }
      }

      const numbers = [];

      while (numbers.length !== this.participants.length) {
        let drawed = Math.floor(Math.random() * this.participants.length);

        if (!numbers.includes(drawed)) {
          numbers.push(drawed);

          const name = this.participants[drawed];

          let index;

          if (this.teamA.find((person) => person.participant === name)) {
            index = this.teamA.findIndex(
              (person) => person.participant === name
            );

            this.teamA[index].champion = draft[drawed];
          } else {
            index = this.teamB.findIndex(
              (person) => person.participant === name
            );

            this.teamB[index].champion = draft[drawed];
          }
        } else {
          drawed = Math.floor(Math.random() * this.participants.length);
        }
      }

      this.actualTeamA = this.teamA;
      this.actualTeamB = this.teamB;
      localStorage.setItem("teamA", JSON.stringify(this.actualTeamA));
      localStorage.setItem("teamB", JSON.stringify(this.actualTeamB));

      this.reset();
    },

    reset() {
      this.teamA = [];
      this.teamB = [];
    },

    clearEverything() {
      this.actualTeamA = [];
      this.actualTeamB = [];
      this.participants = [];
      localStorage.removeItem("teamA");
      localStorage.removeItem("teamB");
      localStorage.removeItem("participants");
    },
  },

  async mounted() {
    const data = await Promise.all(
      [
        "./data/champions.json",
        "./data/items.json",
        "./data/spells.json",
        "./data/boots.json",
      ].map(async (path) => {
        const response = await fetch(path);
        return response.json();
      })
    );

    [this.champions, this.items, this.spells, this.boots] = data;

    if (localStorage.teamA && localStorage.teamB && localStorage.participants) {
      this.participants = JSON.parse(localStorage.participants);
      this.actualTeamA = JSON.parse(localStorage.teamA);
      this.actualTeamB = JSON.parse(localStorage.teamB);
    }
  },
}).mount("#app");
