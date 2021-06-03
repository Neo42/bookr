import {mockUser} from '../support/generate'

describe('应用', () => {
  beforeEach(() => {
    cy.viewport('macbook-13')
  })
  it('支持典型的用户使用流程', () => {
    const user = mockUser()

    cy.visit('/')

    cy.findByRole('button', {name: /注册/}).click()
    cy.findByRole('dialog').within(() => {
      cy.findByRole('textbox', {name: /用户名/}).type(user.username)
      cy.findByLabelText(/密码/).type(user.password)
      cy.findByRole('button', {name: /注册/}).click()
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /发现/}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findByRole('searchbox', {name: /搜索/}).type('Harry Potter{enter}')
      cy.findByRole('listitem', {
        name: /harry potter and the chamber of secrets/i,
      }).within(() => {
        cy.findByRole('button', {name: /加入书单/}).click()
      })
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /未读/}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1)
      cy.findAllByRole('link', {
        name: /harry potter and the chamber of secrets/i,
      }).click()
    })

    cy.findByRole('main').within(() => {
      cy.findByRole('textbox', {name: /笔记/}).type('是本好书！')
      cy.findByLabelText('加载中').should('exist')
      cy.findByLabelText('加载中').should('not.exist')

      cy.findByRole('button', {name: /标为已读/}).click()
      cy.findByRole('radio', {name: /5 分/}).click({force: true})
    })

    cy.findByRole('navigation').within(() => {
      cy.findByRole('link', {name: /已读/}).click()
    })

    cy.findByRole('main').within(() => {
      cy.findAllByRole('listitem').should('have.length', 1)
      cy.findByRole('radio', {name: /5 分/}).should('be.checked')
      cy.findAllByRole('link', {
        name: /harry potter and the chamber of secrets/i,
      }).click()
    })

    cy.findByRole('main').within(() => {
      cy.findByRole('button', {name: /移除/}).click()
      cy.findByRole('textbox', {name: /笔记/}).should('not.exist')
      cy.findByRole('radio', {name: /5 分/}).should('not.exist')
    })
  })
})
