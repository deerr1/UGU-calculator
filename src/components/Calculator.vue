<template>
  <div class="flex row justify-center">
      <div class="center col-12 text-h5 text-center">
          Калькулятор поступления
      </div>
      <div class="col-12 text-h6 text-center q-mt-md">
          Баллы ЕГЭ
      </div>
      <div class="col-12 flex row justify-center">
            <q-select class="col-xl-7 col-lg-7 col-md-8 col-sm-11 col-xs-11 q-my-lg text-h6"
              v-for="(sub, index) in subject" :key="sub.subject"
              :readonly="(sub.subject!==null) ? true : false"
              v-model="sub.subject"
              :options="options"
              @input="addSubject(sub.subject, index)"
              input-class="inputSelect"
            >
            <template v-slot:append>
              <div class="flex col-12 row justify-end">
                <q-input class=" col-xl-7 col-lg-7 col-md-8 col-sm-11 col-xs-4"
                v-if="sub.subject!==null"
                :rules="[ val => Number(val) >= Number(limitScores[sub.subject]) || 'Ваши баллы меньше минимальных' ]"
                v-model="sub.score" type="number" label="Баллы"
                :min="limitScores[sub.subject]"
                />
                <q-icon
                  v-if="index!=0 || sub.subject!==null"
                  class="cursor-pointer q-my-auto q-mr-md"
                  name="clear"
                  v-on:click.stop="deleteSubject(sub.subject, index)"
                />
              </div>
            </template>
            </q-select>
      </div>
      <div class="col-xl-7 col-lg-7 col-md-8 col-sm-11 col-xs-11">
        <q-btn v-if="subject.length <5" color="primary" icon="add"  @click="subject.push({'subject':null, 'score':0})" />
      </div>
      <div class="flex row justify-between col-xl-7 col-lg-7 col-md-8 col-sm-11 col-xs-11 q-mt-lg">
        <div class="text-h5">
          Сумма:
        </div>
        <div class="text-h5 q-mr-xl">
          {{sumScore()}}
        </div>
      </div>
      <div class="col-12 flex row justify-center q-mt-xl">
        <div class="col-xl-5 col-lg-5 col-md-10 col-sm-10 col-xs-12">
          <div class="text-center text-h5">
            Выбор направления
          </div>
          <div class="flex row justify-center q-mt-lg">
            <div class="text-h6 col-5">
              Приоритет
            </div>
            <div class="text-h6 col-6">
              Направление
            </div>
          </div>
          <div v-for="(dir, index) in directionsSelect" :key="index" class="flex row justify-center q-mt-lg">
            <div class="text-h4 col-4">
              {{index+1}}:
            </div>
            <div class="text-h6 col-7">
              <q-select v-model="dir[0]"
                :options="directions"
                label="Направление"
                :readonly="(dir[0]!==null) ? true : false"
                filled
                @input="addDirection(dir, index)"
                >
                <template v-slot:append >
                <div class="flex row justify-center">
                  <q-icon
                    v-if="index!==0 || dir[0]!==null"
                    class="cursor-pointer"
                    name="clear"
                    v-on:click.stop="deleteDirection(dir[0], index)"
                  />
                </div>
                </template>
              </q-select>
            </div>
          </div>
          <div class="q-ml-lg">
            <q-btn v-if="directionsSelect.length <5" color="primary" icon="add"  @click="directionsSelect.push([null])" />
          </div>
        </div>

        <div class="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-xs-11 q-mb-xl">
          <div class="text-center text-h5">
            Ситуация поступления
          </div>
          <div class="flex row desktop-only justify-between q-mt-lg">
            <div class="text-h6 text-center col-4 ">
              Место в рейтинге на данный момент
            </div>
            <div class="text-h6 text-center col-3">
              Поступлени на бюджет
            </div>
            <div class="text-h6 text-center col-4">
              Поступлени на бюджет при подаче документов
            </div>
          </div>
          <div class="flex row mobile-only justify-between q-mt-lg">
            <div class="text-subtitle2 col-4 ">
              Место в рейтинге на данный момент
            </div>
            <div class="text-subtitle2 text-center col-3">
              Поступлени на бюджет
            </div>
            <div class="text-subtitle2 text-center col-4">
              Поступлени на бюджет при подаче документов
            </div>
          </div>
          <div v-for="(item, index) in score" :key="index" class="flex row justify-between q-mt-lg">
            <div class="desktop-only text-body1  text-center col-4">
              {{item.score}}
            </div>
            <div class="desktop-only text-body1 text-center col-3">
              {{item.budget}}
            </div>
            <div class="desktop-only text-body1 text-center col-4">
              {{item.doc}}
            </div>
            <div class="mobile-only text-body2 text-center col-4">
              {{item.score}}
            </div>
            <div class="mobile-only text-body2 text-center col-3">
              {{item.budget}}
            </div>
            <div class="mobile-only text-body2 text-center col-4">
              {{item.doc}}
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import dataInst from "../assets/data.json"
import directions from "../assets/directions.json"
import limitScores from "../assets/limitScores.json"
import abbreviations from "../assets/abbreviations.json"
import numberSeats from "../assets/numberSeats.json"
export default {
    data() {
    return {
        sum: 0,
        limitScores,
        dataInst: dataInst[0],
        subject: [
            {
              "subject":null,
              "score":0
            },
        ],
        options: [],
        directionsSelect: [
          [null],
        ],
        directions: [],
        score: [
        ],
    };
  },
  watch:{
    sum: function(val){
      this.sum = val
      this.listScoreGenerate()
    }
  },
  mounted(){
    Object.keys(limitScores).forEach((key) => {
      this.options.push(key)
    })
  },
  methods: {
    // функция удаления предмета из списка выбранных
    deleteSubject(sub, index) {
      if (this.subject.length == 1){
        this.subject[0].subject = null
        this.subject[0].score = 0
        if(sub !== null)
          this.options.push(sub)
        this.sortedSubject()
      }
      else{
        this.subject.splice(index, 1)
        if(sub !== null)
          this.options.push(sub)
        this.sortedSubject()
      }
    },
    // функция добавления предмета в список выбраных
    addSubject(sub, index){
      this.options.splice(this.options.indexOf(sub),1)
      this.subject.splice(index, 1, {"subject":sub, "score":0})
      this.sortedSubject()
    },
    // функция удаления направления из списка выбранных
    deleteDirection(dir, index){
      if (this.directionsSelect.length == 1){
        this.directionsSelect[0][0] = null
        if(dir !== null){
          // this.directions.push(dir)
          this.score.splice(index, 1)
          this.sortedSubject()
        }
      }
      else{
        this.directionsSelect.splice(index, 1)
        if(dir !== null){
          // this.directions.push([dir])
          this.sortedSubject()
          this.score.splice(index, 1)
        }
        this.listScoreGenerate()
      }
    },
    // функция добавления направления в список выбранных
    addDirection(dir, index){
      this.directions.splice(this.directions.indexOf(dir[0]),1)
      this.directionsSelect.splice(index, 1, dir)
      this.dataScore(index)
    },
    // функция рачистывания мест по всем направлениям в списке
    listScoreGenerate(){
      this.score = []
      for(var i=0; i<this.directionsSelect.length; i++){
        if(this.directionsSelect[i][0] !== null)
          this.dataScore(i)
      }

    },
    // функция расчитывания мест в списках
    dataScore(index){
      var sub = this.directionsSelect[index][0]
      var data = this.dataInst.filter(res => String(res["Специальность"]).includes(abbreviations[sub]))
      var score = this.sumScore()

      var dataForScore = data.slice()
      var dataForDoc = data.slice()
      dataForScore.push({"Код абитуриента":1000,"Приоритет":index+1, "Документы":"Нет", "Суммарный балл": score})
      dataForDoc.push({"Код абитуриента":1000,"Приоритет":index+1, "Документы":"Да", "Суммарный балл": score})
      dataForScore = this.directionsSorted(dataForScore)
      dataForDoc = this.directionsSorted(dataForDoc)

      console.log(dataForScore)
      var indexBudget = dataForScore.findIndex(elem=> elem['Код абитуриента'] == 1000)+1
      var indexDoc = dataForDoc.findIndex(elem=> elem['Код абитуриента'] == 1000)+1
      this.score.push({
          index: index,
          score: dataForScore.map(function(e){return e['Код абитуриента']}).indexOf(1000)+1 +" из "+ dataForScore.length,
          budget: `${ (indexBudget<=numberSeats[sub]) ? "Да\n": "Нет\n" }` + indexBudget +" из "+ numberSeats[sub],
          doc: `${ (indexDoc<=numberSeats[sub]) ? "Да\n": "Нет\n" }` + indexDoc +" из "+ numberSeats[sub],
        })
    },
    //функция для сортировки списка с абитуринтом, в дальнейшем приритеты менять в ней
    directionsSorted(data){
      return data.sort(function(a,b){
        if(a['Суммарный балл'] > b['Суммарный балл']){
          return -1
        }
        else if(a['Суммарный балл'] < b['Суммарный балл']){
          return 1
        }
        else if(a['Документы'].length< b['Документы'].length){
          return -1
        }
        else if(a['Документы'].length > b['Документы'].length){
          return 1
        }
        else if(a['Приоритет']< b['Приоритет']){
          return -1
        }
        else if(a['Приоритет']> b['Приоритет']){
          return 1
        }
        else{
          return 0
        }
        })
    },
  // функция суммирования баллов
    sumScore(){
      var score = 0
      for(var i=0; i<this.subject.length; i++){
        score+=Number(this.subject[i].score)
      }
      this.sum = score
      return score
    },
  // функция определения направления по определенным предметам
    sortedSubject(){
      this.directions = []
      var dir = []
      directions.forEach((element) => {
        var subject1 = element["subjects"]["required"].concat(element["subjects"]["additional"][0])
        var subject2 = element["subjects"]["required"].concat(element["subjects"]["additional"][1])
        if( this.containsSubject(subject1, this.subject) || this.containsSubject(subject2, this.subject) ){
          dir = dir.concat(element["direction"])
        }
      })
      var filter = this.directionsSelect
      dir = dir.filter(function(el){
        return filter.indexOf(el) == -1
      })
      this.directions = dir
    },
  // функция определения вхождения предмета в перечень направления
    containsSubject(where, what){
      var count = 0;
      for(var i=0; i<what.length; i++){
        if(where.indexOf(what[i].subject) == -1){
          return false;
        }
        else if(where.indexOf(what[i].subject) != -1){
          count++;
        }
      }
      if(count == where.length)
        return true;
      else
        return false;
    },
    inputSet(value){
      var index = 0
      console.log(value)
      var arr = this.subject[index]
      arr = [arr[0], value]
      this.subject.splice(index, 1, arr)
      console.log(this.subject)
    }
  }
}
</script>

<style>
.inputSelect{
  font-size:1px
}
</style>