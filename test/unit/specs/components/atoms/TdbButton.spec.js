import { mount } from '@vue/test-utils'
import TdbButton from '@/components/atoms/TdbButton.vue'

// ex) TdbButtonのプロパティのtypeはデフォルトで、tdb-buttonクラスを持つbutton要素で構成されている。というテストケース
// describeを用いてテスト対象をカテゴライズ
describe('TdbButton', () => {
  describe('プロパティ', () => {
    describe('type', () => {
      describe('デフォルト', () => {
        // itで個別のテスト対象とこう振る舞うべきという定義を行う
        it('tdb-buttonクラスを持つbutton要素で構成されていること', () => {
          const button = mount(TdbButton)
          // expectでテスト対象に期待される振る舞いを定義
          expect(button.is('button').to.equal(true))
          expect(button.classes()).to.include('tdb-button')
        })
      })

      describe('button', () => {
        // itで個別のテスト対象とこう振る舞うべきという定義を行う
        it('tdb-buttonクラスを持つbutton要素で構成されていること', () => {
          const button = mount(TdbButton, {
            propsData: {type: 'button'}
          })
          // expectでテスト対象に期待される振る舞いを定義
          expect(button.is('button').to.equal(true))
          expect(button.classes()).to.include('tdb-button')
        })
      })

      describe('text', () => {
        // itで個別のテスト対象とこう振る舞うべきという定義を行う
        it('tdb-button-textクラスを持つbutton要素で構成されていること', () => {
          const button = mount(TdbButton, {
            propsData: {type: 'text'}
          })
          // expectでテスト対象に期待される振る舞いを定義
          expect(button.is('button').to.equal(true))
          expect(button.classes()).to.include('tdb-button-text')
        })
      })

      describe('disabled', () => {
        describe('デフォルト', () => {
          it('disabled属性が付与されていないこと', () => {
            const button = mount(TdbButton)
            expect(button.attributes().disabled).to.be.an('undefined')
          })
        })

        describe('true', () => {
          it('disabled属性が付与されていること', () => {
            const button = mount(TdbButton, {
              propsData: {disabled: true}
            })
            expect(button.attributes().disabled).to.equal('disabled')
          })
        })

        describe('false', () => {
          it('disabledが付与されていないこと', () => {
            const button = mount(TdbButton)
            expect(button.attributes().disabled).to.be.an('undefined')
          })
        })
      })
    })

    describe('イベント', () => {
      describe('click', () => {
        it('発行されていること', () => {
          const button = mount(TdbButton)
          button.trigger('click')
          expect(button.emitted().click.length).to.equal(1)
        })
      })
    })

    describe('スロット', () => {
      describe('コンテンツ挿入あり', () => {
        it('挿入されていること', () => {
          const button = mount(TdbButton, {
            slots: {default: '<p>hello</p>'}
          })
          expect(button.text()).to.equal('hello')
        })
      })

      describe('コンテンツ挿入なし', () => {
        it('挿入されていないこと', () => {
          const button = mount(TdbButton)
          expect(button.text()).to.equal('')
        })
      })
    })

  })
})